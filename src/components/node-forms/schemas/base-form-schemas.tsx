import { z } from "zod";

function getBaseFormSchema(mappedTypes: string[]) {
  return z.object({
    nodeTitle: z
      .string()
      .min(2, { message: "Node name must be at least 2 characters." }),
    residence: z.string().min(2, { message: "Residence is required." }),
    type: z.string().refine((val) => mappedTypes.includes(val), {
      message: "Invalid company type.",
    }),
  });
}

function llcCompanyFormSchema() {
  return z.object({
    // people: z
    //   .array(
    //     z.object({
    //       name: z.string().min(1, { message: "Name is required." }),
    //       memberInterest: z.coerce
    //         .number()
    //         .positive({ message: "Invalid interest. Must be greater than 0." }),
    //       residence: z.string().min(2, { message: "Residence is required." }),
    //     }),
    //   )
    //   .min(1, { message: "At least one person is required." }),
    shareCapital: z.coerce
      .number()
      .positive({ message: "Invalid share capital. Must be greater than 0." }),
    directors: z.coerce.number().positive({
      message: "Invalid number of directors. Must be greater than 0.",
    }),
  });
}

function stockHoldingCompanyFormSchema() {
  return llcCompanyFormSchema();
}

function partnershipCompanyFormSchema() {
  return z.object({});
}

function foundationCompanyFormSchema() {
  return z.object({
    directors: z.coerce.number().min(2, {
      message: "Invalid number of directors. Must be greater than 0.",
    }),
  });
}

function getCompanyFormSchema(companyType: string) {
  switch (companyType.toLowerCase()) {
    case "llc":
      return llcCompanyFormSchema();
    case "stock_holding_company":
      return stockHoldingCompanyFormSchema();
    case "partnership":
      return partnershipCompanyFormSchema();
    case "foundation":
      return foundationCompanyFormSchema();
    default:
      return z.object({});
  }
}

export { getBaseFormSchema, getCompanyFormSchema };
