import { InferSelectModel, relations } from "drizzle-orm";
import { integer, numeric, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { OrderStatus } from "~/types/order";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: integer("order_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  amount: numeric("amount").notNull(), // in cents
  status: varchar("status").default(OrderStatus.PENDING),
  transactionId: varchar("transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
export type Order = InferSelectModel<typeof orders>;

export const orderLineItems = pgTable("order_line_items", {
  id: serial("id").primaryKey(),
  itemName: varchar("item_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price").notNull(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
export type OrderLineItem = InferSelectModel<typeof orderLineItems>;

export const orderRelations = relations(orders, ({ many }) => ({
  lineItems: many(orderLineItems),
}));

export const orderLineItemRelations = relations(orderLineItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderLineItems.orderId],
    references: [orders.id],
  }),
}));