"use server";

import { revalidatePath } from "next/cache";
import { AdminSaasService } from "../server/admin-saas.service";
import { CreateOrganizationSchema, UpdateUserSchema } from "../server/admin-saas.schema";

const service = new AdminSaasService();

export async function createOrganizationAction(formData: any) {
  try {
    const validatedData = CreateOrganizationSchema.parse(formData);
    await service.createOrganization(validatedData);
    revalidatePath("/dashboard-admin/organizaciones");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating organization:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserAction(formData: any) {
  try {
    const validatedData = UpdateUserSchema.parse(formData);
    await service.updateUser(validatedData);
    revalidatePath("/dashboard-admin/usuarios");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message };
  }
}
