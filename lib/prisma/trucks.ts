import prisma from ".";

export async function getTrucks() {
  try {
    const trucks = await prisma.trucks.findMany({});
    return { trucks };
  } catch (e) {
    return { e };
  }
}
