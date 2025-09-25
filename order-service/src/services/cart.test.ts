import { CartRepository } from "~/repositories/cart"
import type { CartRepositoryType } from "~/types/repository"
import { CreateCart } from "./cart"

describe('[services] cart', () => {
  let repository: CartRepositoryType

  beforeEach(() => {
    repository = CartRepository
  })

  afterEach(() => {
    repository = {} as CartRepositoryType
  })

  it('should return correct data when create cart', async () => {
    const mockCart = {
      title: 'iPhone',
      amount: 1200
    }

    jest.spyOn(repository, 'create').mockResolvedValue({
      message: 'created cart from repository',
      input: mockCart
    })

    const res = await CreateCart(mockCart, repository)

    expect(res).toEqual({
      message: 'created cart from repository',
      input: mockCart
    })
  })
})