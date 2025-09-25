import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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

  @IsOptional()
  @IsPositive()
  price?: number;

  stock?: number;
}