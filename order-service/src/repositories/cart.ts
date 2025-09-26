import { eq } from "drizzle-orm";
import { db } from "~/db/db-connection";
import { Cart, CartLineItem, cartLineItems, carts } from "~/db/schema";
import { NotFoundError } from "~/utils/error/errors";

export interface CartRepositoryType {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  findCart: (customerId: number) => Promise<Cart>;
  updateCart: (lineItemId: number, quantity: number) => Promise<CartLineItem>;
  deleteFromCart: (lineItemId: number) => Promise<Boolean>;
  clearCartData: (id: number) => Promise<Boolean>;
}

const createCart = async (customerId: number, lineItem: CartLineItem): Promise<number> => {
  const result = await db
    .insert(carts)
    .values({ customerId })
    .returning()
    .onConflictDoUpdate({
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });

  const [{ id }] = result;

  if (id > 0) {
    await db
      .insert(cartLineItems)
      .values({
        cartId: id,
        productId: lineItem.productId,
        itemName: lineItem.itemName,
        variant: lineItem.variant,
        quantity: lineItem.quantity,
        price: lineItem.price,
      })
  }
  return id;
}

const findCart = async (customerId: number): Promise<Cart> => {
  const cart = await db
    .query
    .carts
    .findFirst({
      where: (cart, { eq }) => eq(cart.customerId, customerId),
      with: {
        lineItems: true,
      },
    })

  if (!cart) throw new NotFoundError("cart not found");

  return cart;
};

const updateCart = async (lineItemId: number, quantity: number): Promise<CartLineItem> => {
  const [lineItem] = await db
    .update(cartLineItems)
    .set({ quantity, updatedAt: new Date() })
    .where(eq(cartLineItems.id, lineItemId))
    .returning();

  if (!lineItem) throw new NotFoundError("cart line item not found");

  return lineItem;
}

const deleteFromCart = async (lineItemId: number): Promise<boolean> => {
  await db
    .delete(cartLineItems)
    .where(eq(cartLineItems.id, lineItemId))
    .returning();

  return true
}

const clearCartData = async (id: number): Promise<boolean> => {
  await db
    .delete(carts)
    .where(eq(carts.id, id))
    .returning();

  return true
}

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteFromCart,
  clearCartData,
}