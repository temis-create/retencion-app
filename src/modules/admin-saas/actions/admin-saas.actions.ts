"use server";

import { revalidatePath } from "next/cache";
import { AdminSaasService } from "../server/admin-saas.service";
import { 
  PlanForm, 
  AssignPlan, 
  UpdateOrganizationStatus 
} from "../server/admin-saas.schema";

const service = new AdminSaasService();

export async function updateOrganizationStatusAction(data: UpdateOrganizationStatus) {
  try {
    await service.updateOrganizationStatus(data);
    revalidatePath("/dashboard-admin/organizaciones");
    revalidatePath(`/dashboard-admin/organizaciones/${data.id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignPlanAction(data: AssignPlan) {
  try {
    await service.assignPlan(data);
    revalidatePath("/dashboard-admin/organizaciones");
    revalidatePath(`/dashboard-admin/organizaciones/${data.organizationId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function upsertPlanAction(data: PlanForm) {
  try {
    await service.upsertPlan(data);
    revalidatePath("/dashboard-admin/planes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePlanAction(id: string) {
  try {
    await service.deletePlan(id);
    revalidatePath("/dashboard-admin/planes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
