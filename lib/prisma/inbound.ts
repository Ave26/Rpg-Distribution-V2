import { InventoryMethod } from "@/pages/api/products/create";
import prisma from ".";
import { TScanDataFinal } from "@/pages/api/inbound/scan";

export async function scanBarcode(
  assignedProduct: TScanDataFinal,
  userId: string
) {
  const { date: dt, method, quality } = assignedProduct;
  const date = `${dt.toLocaleString().split("T")[0]}T00:00:00.000+00:00`; // convert date into mongo db iso
  // get date-type based on method
  const typeField: Record<InventoryMethod, "expiry" | "received"> = {
    FEFO: "expiry",
    FIFO: "received",
    LIFO: "received",
  };

  const type = typeField[method as InventoryMethod];

  let message: string = "";
  await prisma
    .$transaction(async (prisma) => {
      let binIdPocket: string | undefined;
      if (quality === "Damage") {
        console.log("inserted in Damage Bin"); // working after date update
        const {
          date: _,
          quantity,
          category,
          threshold,
          method,
          ...rest
        } = assignedProduct;

        const damageBin = await prisma.damageBins.findFirst({
          where: {
            category: "INBOUND DAMAGE",
            OR: [
              {
                PO: { equals: rest.purchaseOrder },
              },
              {
                assignedProducts: {
                  every: { purchaseOrder: rest.purchaseOrder },
                },
              },
              { assignedProducts: { none: {} } },
            ],
          },
          orderBy: [{ row: "asc" }, { shelf: "asc" }],
        });

        await prisma.damageBins
          .update({
            where: { id: damageBin?.id },
            data: {
              PO: rest.purchaseOrder,
              assignedProducts: {
                create: {
                  ...rest,
                  dateInfo: { date, type },
                  // dateReceived: date,
                  // expirationDate: date,
                  usersId: userId,
                  status: "Rejected",
                  binId: "",
                },
              },
            },
          })
          .catch((e) => console.log(e));

        message = "INSERTED INTO DAMAGE BIN";
      } else {
        const {
          category,
          quantity,
          threshold,
          date: _,
          method,
          ...rest
        } = assignedProduct;
        console.log("finding available bins", assignedProduct);

        const bins = await prisma.bins
          .findMany({
            orderBy: [
              { category: "asc" },
              { rackName: "asc" },
              { row: "asc" },
              { shelfLevel: "asc" },
            ],
            where: {
              AND: [
                { isAvailable: true }, // Ensure the bin is available
                { category }, // Match the category
                {
                  OR: [
                    {
                      assignedProducts: {
                        some: { damageBinsId: { isSet: true } },
                      },
                    },
                    {
                      assignedProducts: {
                        every: {
                          skuCode: { equals: rest.skuCode },
                          dateInfo: { equals: { date, type } }, // Match the date info
                          damageBinsId: { isSet: false }, // Products not damaged
                          status: { in: ["Default", "Queuing"] }, // Status is either Default or Queuing
                          quality: { equals: "Good" },
                        },
                      },
                    },
                  ],
                },
              ],
            },

            select: {
              _count: {
                select: {
                  assignedProducts: {
                    where: {
                      damageBinsId: { isSet: false },
                      status: { in: ["Default", "Queuing"] },
                    },
                  },
                },
              },

              id: true,
              capacity: true,
              isAvailable: true,
              category: true,
              assignedProducts: {
                where: {
                  damageBinsId: { isSet: false },
                  status: { in: ["Default", "Queuing"] },
                },
                take: 1,
              }, // Retrieve assigned products to count them manually
            },
            take: 3, // Limit the result to 2 bins
          })
          .catch((e) => {
            console.log(e);
          });
        console.log(bins);

        console.log(rest.skuCode);
        const key = `${rest.skuCode}_${date.toString().slice(0, 10)}_${type}`;
        console.log(key);
        if (!bins) return "can't find bin";
        for (const bin of bins) {
          const product = bin.assignedProducts?.[0] ?? {
            skuCode: "",
            dateInfo: { date: null, type: "" },
          };
          const productDate = product.dateInfo.date
            ? product.dateInfo.date.toISOString().slice(0, 10)
            : "";
          const passKey =
            product.skuCode && date && product.dateInfo.type
              ? `${product.skuCode}_${productDate}_${product.dateInfo.type}`
              : "";

          console.log(passKey);

          console.log(bin.id);
          if (bin.capacity > bin?._count.assignedProducts) {
            if (bin.isAvailable) {
              console.log("block initiated");
              if (bin._count.assignedProducts === 0) {
                console.log("select the first bin", bin.id);
                const p = await prisma.assignedProducts
                  .create({
                    data: {
                      ...rest,
                      binId: bin.id,
                      usersId: userId,
                      dateInfo: { date, type },
                    },
                  })
                  .then((product) => {
                    console.log(product);
                  })
                  .catch((e) => console.log(e));

                break;
              } else {
                console.log("proceed to comparison");
                // comparison check

                console.log(passKey);
                console.log(key);
                if (key === passKey) {
                  console.log(true);
                  await prisma.assignedProducts
                    .create({
                      data: {
                        ...rest,
                        binId: bin.id,
                        usersId: userId,
                        dateInfo: { date, type },
                      },
                    })
                    .catch((e) => console.log(e));
                  break;
                } else {
                  console.log(false);
                  console.log(bin.id);
                  continue;
                }
              }
            } else {
              continue;
            }
          } else {
            await prisma.bins.update({
              where: {
                id: bin.id,
              },
              data: {
                isAvailable: false,
              },
            });
          }
        }
        const count = await prisma.assignedProducts.count({
          where: { binId: binIdPocket, quality: "Good" },
        });

        message = `Product Count: ${count}`;
      }
    })
    .catch((e) => {
      message = "";
      console.error(e);
    });
  return { message };
}

function validateProduct(skuName: string, date: Date, type: string) {
  return false;
}
