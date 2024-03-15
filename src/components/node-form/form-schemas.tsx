import { z } from "zod";

function getFormSchema(mappedTypes: string[]) {
  return z.object({
    nodeNamed: z
      .string()
      .min(2, { message: "Node name must be at least 2 characters." }),
    nodeType: z
      .string()
      .refine((val) => mappedTypes.includes(val), {
        message: "Invalid node type.",
      }),
  });
}

function getCompanyFormSchema() {
  return z.object({
    people: z.array(
      z.object({
        name: z.string().min(1, { message: "Name is required." }),
        surname: z.string().min(1, { message: "Surname is required." }),
        residence: z.string().min(1, { message: "Residence is required." }),
      }),
    ),
  });
}

export { getFormSchema, getCompanyFormSchema };
