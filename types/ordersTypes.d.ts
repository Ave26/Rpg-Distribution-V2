import { orders as PrismaOrders } from "@prisma/client";

interface Orders extends PrismaOrders {
  users: {
    id: string;
    username: string;
  } | null;
}

export { Orders };
