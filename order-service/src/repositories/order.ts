import { eq } from "drizzle-orm";
import { db } from "~/db/db-connection";
import { orderLineItems, orders } from "~/db/schema";
import { OrderWithLineItems } from "~/dto/order-request";
import { OrderStatus } from "~/types/order";
import { NotFoundError } from "~/utils/error/errors";

export interface OrderRepositoryType {
  createOrder: (lineItems: OrderWithLineItems) => Promise<number>;
  findOrder: (id: number) => Promise<OrderWithLineItems | null>;
  updateOrder: (id: number, status: OrderStatus) => Promise<OrderWithLineItems>;
  deleteOrder: (id: number) => Promise<Boolean>;
  findOrdersByCustomerId: (customerId: number) => Promise<OrderWithLineItems[]>;
  findOrderByOrderNumber: (orderNumber: number) => Promise<OrderWithLineItems | null>;
}

const createOrder = async (lineItems: OrderWithLineItems): Promise<number> => {
  const result = await db.insert(orders)
    .values({
      customerId: lineItems.customerId,
      orderNumber: lineItems.orderNumber,
      status: lineItems.status,
      transactionId: lineItems.transactionId,
      amount: lineItems.amount
    })
    .returning();

  const [{ id }] = result;

  if (id > 0) {
    for (const item of lineItems.orderItems) {
      await db.insert(orderLineItems).values({
        orderId: id,
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price.toString(),
      }).execute();
    }
  }

  return id;
};

const findOrder = async (id: number): Promise<OrderWithLineItems | null> => {
  const order = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    with: {
      lineItems: true
    }
  })

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order as unknown as OrderWithLineItems;
}

const updateOrder = async (id: number, status: OrderStatus): Promise<OrderWithLineItems> => {
  await db.update(orders)
    .set({ status })
    .where(eq(orders.id, id))
    .execute()

  const order = await findOrder(id);
  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order;
};

const deleteOrder = async (id: number): Promise<Boolean> => {
  await db.delete(orders).where(eq(orders.id, id)).execute();
  return true;
};

const findOrdersByCustomerId = async (customerId: number): Promise<OrderWithLineItems[]> => {
  const orders = await db.query.orders.findMany({
    where: (orders, { eq }) => eq(orders.customerId, customerId),
    with: {
      lineItems: true
    }
  })

  return orders as unknown as OrderWithLineItems[];
}

const findOrderByOrderNumber = async (orderNumber: number): Promise<OrderWithLineItems | null> => {
  const order = await db.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.orderNumber, orderNumber),
    with: {
      lineItems: true
    }
  })

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order as unknown as OrderWithLineItems;
}

export const OrderRepository: OrderRepositoryType = {
  createOrder,
  findOrder,
  updateOrder,
  deleteOrder,
  findOrdersByCustomerId,
  findOrderByOrderNumber
}