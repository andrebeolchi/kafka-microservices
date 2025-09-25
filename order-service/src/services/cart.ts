import type { CartRepositoryType } from "~/types/repository"

export const CreateCart = async (input: any, repository: CartRepositoryType) => {
  const data = await repository.create(input)
  return data
}

export const GetCart = async (input: any, repository: CartRepositoryType) => {
  const data = await repository.find(input)
  return data
}

export const EditCart = async (input: any, repository: CartRepositoryType) => {
  const data = await repository.update(input)
  return data
}

export const DeleteCart = async (input: any, repository: CartRepositoryType) => {
  const data = await repository.delete(input)
  return data
}