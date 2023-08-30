import { GetResult } from "@prisma/client/runtime/library";
import prisma from ".";

// inbound
// if the user has encountered a damage bin marked it as damged
interface Assignment {
  id: string;
  dateReceive: Date | null;
  purchaseOrder: string;
  expirationDate: Date | null;
  boxSize: string | null;
  isDamage: boolean | null;
  productId: string | null;
  binId: string | null;
  usersId: string | null;
  damageBinId: string | null;
}

interface Bin {
  id: string;
  isAvailable: boolean;
  capacity: number;
  shelfLevel: number;
  assignment: Assignment[];
}

interface Product {
  id: string;
  barcodeId: string;
  category: string | null;
  image: string | null;
  price: number | null;
  productName: string;
  sku: string | null;
}

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
    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
    });

    if (product === null) {
      return { message: "Product Not found | coming from the server" };
    } else {
      if (quality === "Good") {
        const categories = await prisma.categories.findFirst({
          where: {
            category: product?.category,
          },
        });
        console.log({ model: "Category Model", categories });
        const racks = await prisma.racks.findFirst({
          where: {
            categoriesId: categories?.id,
          },
        });

        const bins = await prisma.bins.findMany({
          where: {
            racksId: racks?.id,
          },
          include: {
            assignment: true,
          },
        });

        for (const bin of bins) {
          const { dateReceive } = setTime();

          const { availableBin } = await setMethod(
            String(categories?.category),
            bin,
            product,
            expirationDate,
            dateReceive
          );

          if (availableBin) {
            // Found a bin with the same expirationDate in its assignments
            // Create a new assignment
            await prisma.assignment.create({
              data: {
                productId: product?.id,
                binId: String(availableBin?.id),
                boxSize,
                dateReceive,
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
            const binId = bin?.id;
            if (TotalAssignedProduct >= capacity) {
              await prisma.bins.update({
                where: {
                  id: binId,
                },
                data: {
                  isAvailable: false,
                },
              });
            }
            const row = availableBin?.row;
            const shelfLevel = availableBin?.shelfLevel;

            return {
              message: `Product Added ${TotalAssignedProduct}`,
              TotalAssignedProduct,
              capacity,
              row,
              shelfLevel,
            };
          }
        }
      }
    }
  } catch (error) {
    return { error };
  }
}

async function findManyBins(racksId: string, binId: string) {
  const bins = await prisma.bins.findMany({
    where: {
      // id: binId,
      racksId: racksId,
    },
  });
  return { bins };
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

function setTime() {
  let dateReceive = new Date();

  // Set the time component to zero
  dateReceive.setUTCHours(0);
  dateReceive.setUTCMinutes(0);
  dateReceive.setUTCSeconds(0);
  dateReceive.setUTCMilliseconds(0);

  // Format the date without time zone offset in local time
  dateReceive.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return { dateReceive };
}

const items = [
  { expirationDate: "2023-08-15", name: "Item 1" },
  { expirationDate: "2023-07-30", name: "Item 2" },
  { expirationDate: "2023-08-05", name: "Item 3" },
];

function setCapacity(boxSize: string, bin: Bin, product: Product) {
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

async function setMethod(
  category: string,
  bin: Bin,
  product: Product,
  expirationDate: Date,
  dateReceive: Date
) {
  // prototype
  let availableBin;
  console.log(category);
  switch (category) {
    case "Food":
      console.log("FEFO Method");

      availableBin = await prisma.bins.findFirst({
        where: {
          id: bin?.id,
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

      break;
    case "Laundry":
    case "Cleaning":
      console.log("FIFO Method");

      availableBin = await prisma.bins.findFirst({
        where: {
          id: bin?.id,
          isAvailable: true,
          assignment: {
            every: {
              productId: {
                equals: product?.id,
              },
              dateReceive: {
                equals: dateReceive,
              },
            },
          },
        },
      });

      break;

    default:
      console.log("No Categories Found");
      break;
  }
  return { availableBin };
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
