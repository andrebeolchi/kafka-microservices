import Ajv, { Schema } from "ajv";

const ajv = new Ajv();

export const validateRequest = <T>(body: unknown, schema: Schema) => {
  const validatedData = ajv.compile<T>(schema);

  if (validatedData(body)) {
    return false
  }

  const errors = validatedData.errors?.map((err) => err.message)

  return errors && errors[0]
}