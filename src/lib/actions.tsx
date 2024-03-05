"use server";

import { redirect } from "next/navigation";

export async function navigateToBuilder() {
  redirect("/builder");
}
