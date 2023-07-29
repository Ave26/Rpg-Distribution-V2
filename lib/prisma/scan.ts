import { GetResult } from "@prisma/client/runtime/library";
import prisma from ".";

// inbound
// if the user has encountered a damage bin marked it as damged

export async function scanBarcode(
  barcodeId: string,
  purchaseOrder: string,
  boxSize: string,
  expirationDate: Date,
  quality: string
) {
  let message;
  console.log(quality);
  try {
    // let Data;

    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
    });

    if (product === null) {
      return { message: "Product Not found | coming from the scan server" };
    } else {
      if (quality === "Good") {
        const categories = await prisma.categories.findFirst({
          where: {
            category: product?.category,
          },
        });

        const racks = await prisma.racks.findFirst({
          where: {
            categoriesId: categories?.id,
          },
        });

        const bins = await prisma.bin.findMany({
          where: {
            racksId: racks?.id,
          },
          include: {
            assignment: true,
          },
        });

        for (const bin of bins) {
          const availableBin = await prisma.bin.findFirst({
            where: {
              id: bin.id,
              isAvailable: true,
              assignment: {
                every: {
                  productId: {
                    equals: product?.id,
                  },
                  expirationDate: {
                    equals: expirationDate,
                  },
                },
              },
            },
          });

          if (availableBin) {
            // Found a bin with the same expirationDate in its assignments
            // Create a new assignment
            await prisma.assignment.create({
              data: {
                productId: product?.id,
                binId: availableBin?.id,
                boxSize,
                purchaseOrder,
                expirationDate,
              },
            });

            const TotalAssignedProduct = await prisma.assignment.count({
              where: {
                binId: bin?.id,
              },
            });
            const capacity = Number(bin?.capacity);
            if (TotalAssignedProduct >= capacity) {
              await prisma.bin.update({
                where: {
                  id: bin?.id,
                },
                data: {
                  isAvailable: false,
                },
              });
            }

            return { message: `Product Added ${TotalAssignedProduct}` };
          }
        }
      }

      // TODO: ADD THE SEPARATION OF DIFFERENT BARCODE ID AND DEPENDS IF IT IS THE SAME VARIANTS

      // return {
      //   // categories,
      //   Data,
      //   // TotalAssignedProduct,
      //   // capacity,
      //   // sortedProduct,
      // };
    }
  } catch (error) {
    return { error };
  }
}

function calculateDateBasedOnExpirationDate(items: any) {
  items.sort(
    (a: { expirationDate: string }, b: { expirationDate: string }) =>
      new Date(a.expirationDate).getTime() -
      new Date(b.expirationDate).getTime()
  );

  const firstItem = items[0];

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const expirationDate = new Date(firstItem.expirationDate);
  expirationDate.setHours(0, 0, 0, 0);

  const timeDiff = expirationDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return {
    calculatedDate: currentDate.toISOString().split("T")[0], // Change format as needed
    firstItem: firstItem,
    daysUntilExpiration: daysDiff,
  };
}

const items = [
  { expirationDate: "2023-08-15", name: "Item 1" },
  { expirationDate: "2023-07-30", name: "Item 2" },
  { expirationDate: "2023-08-05", name: "Item 3" },
];

function setCapacity(boxSize: string) {
  let capacity = 0;
  switch (boxSize) {
    case "Small":
      capacity = 20;
      break;
    case "Medium":
      capacity = 15;
      break;
    case "Large":
      capacity = 10;
      break;
    default:
      break;
  }

  return { capacity };
}

// Need to vary depending on the quality of the product
// for instance the product is good then make sure to scan and
// push it to the bin base on Category otherwise push it to damage bay

// DAMAGE TYPES: receiving, inside and outside

// We may need to take care of the FEFO, LIFO and FIFO depending on
// what category

function setMethod(category: string) {
  // prototype
  switch (category) {
    case "Food":
      console.log("FEFO Method");
      break;
    case "Laundry":
      console.log("LIFO METHOD");
      break;
    case "Cleaning":
      console.log("FIFO Method");
      break;

    default:
      console.log("Everyone needs hug");
      break;
  }
}

// InBound
/*
  WE MAY NEED TO ESTABLISH MANUAL AND AUTOMATED FOR BARCODE SCANNER
  manual:
    Allows the user to manually select on what bin it wanted to choose
    Allows the user to manually select what quantity it wanted to set

  Automated:
    Automatically set the bin based on the category and set what method it
    will choose (FEFO, LIFO and FIFO) to deal with product management
    Automatically insert a product into a bin

  need to improve
  what if the product has been inserted to the wrong been and the been
  automatically set the capacity

  answer: create a set capacity button
*/
// Outbound
/*
  For Instance we need to take order
     - 
*/
