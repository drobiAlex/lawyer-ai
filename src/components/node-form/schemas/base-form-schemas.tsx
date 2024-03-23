import { z } from "zod";

function getBaseFormSchema(mappedTypes: string[]) {
  return z.object({
    nodeTitle: z
      .string()
      .min(2, { message: "Node name must be at least 2 characters." }),
    companyResidence: z.string().min(2, { message: "Residence is required." }),
    companyType: z.string().refine((val) => mappedTypes.includes(val), {
      message: "Invalid company type.",
    }),
  });
}

function getCompanyFormSchema() {
  return z.object({
    people: z
      .array(
        z.object({
          name: z.string().min(1, { message: "Name is required." }),
          memberInterest: z.coerce
            .number()
            .positive({ message: "Invalid interest. Must be greater than 0." }),
          residence: z.string().min(2, { message: "Residence is required." }),
        }),
      )
      .min(1, { message: "At least one person is required." }),
    shareCapital: z.coerce
      .number()
      .positive({ message: "Invalid share capital. Must be greater than 0." }),
    directors: z.coerce.number().positive({
      message: "Invalid number of directors. Must be greater than 0.",
    }),
  });
}

export { getBaseFormSchema, getCompanyFormSchema };
