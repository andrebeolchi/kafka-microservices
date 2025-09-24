import { validate, ValidationError } from "class-validator";
import { ClassConstructor, plainToClass } from "class-transformer";

const validationError = async (input: any): Promise<ValidationError[] | false> => {
  const errors = await validate(input, {
    validationError: { target: true },
  })

  if (errors.length) {
    return errors;
  }

  return false;
}

export const RequestValidator = async<T>(type: ClassConstructor<T>, body: any) => {
  const input = plainToClass(type, body);

  const errors = await validationError(input);

  if (errors) {
    const errorMessage = errors.map(err => Object.values(err.constraints || {})).join(", ");
    return { errors: errorMessage, input }
  }

  return { errors: false, input }
}
