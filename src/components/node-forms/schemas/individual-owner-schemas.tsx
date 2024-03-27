import { z } from "zod";

export function getIndividualOwnerSchema() {
  return z.object({
    nodeTitle: z.string().min(1, { message: "Name is required." }),
    residence: z.string().min(2, { message: "Residence is required." }),
  });
}

export function getIndividualOwnerEdgeSchema() {
  return z.object({
    ownershipPercentage: z.coerce.number().positive({
      message: "Ownership percentage must be positive.",
    }),
  });
}
