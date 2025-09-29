import { OrderWithLineItems } from "~/dto/order-request";

export interface OrderRepositoryType {
  createOrder: (lineItems: OrderWithLineItems) => Promise<number>;
  findOrder: (id: number) => Promise<OrderWithLineItems | null>;
  updateOrder: (id: number, status: string) => Promise<OrderWithLineItems>;
  deleteOrder: (id: number) => Promise<Boolean>;
  findOrdersByCustomerId: (customerId: number) => Promise<OrderWithLineItems[]>;
}

export const OrderRepository: OrderRepositoryType = {
  createOrder: function (lineItems: OrderWithLineItems): Promise<number> {
    throw new Error("Function not implemented.");
  },
  findOrder: function (id: number): Promise<OrderWithLineItems | null> {
    throw new Error("Function not implemented.");
  },
  updateOrder: function (id: number, status: string): Promise<OrderWithLineItems> {
    throw new Error("Function not implemented.");
  },
  deleteOrder: function (id: number): Promise<Boolean> {
    throw new Error("Function not implemented.");
  },
  findOrdersByCustomerId: function (customerId: number): Promise<OrderWithLineItems[]> {
    throw new Error("Function not implemented.");
  }
}