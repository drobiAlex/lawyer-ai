import { z } from "zod";

export function getIndividualOwnerSchema() {
  return z.object({
    nodeTitle: z.string().min(1, { message: "Name is required." }),
    residence: z.string().min(2, { message: "Residence is required." }),
  });
}
