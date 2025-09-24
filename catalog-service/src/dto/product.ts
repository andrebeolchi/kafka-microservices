import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @IsPositive()
  price!: number;
  
  @IsNumber()
  stock!: number;
}

export class UpdateProductRequest {
  name?: string;
  
  description?: string;

  @IsPositive()
  price?: number;

  stock?: number;
}