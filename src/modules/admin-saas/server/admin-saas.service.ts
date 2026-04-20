import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/server/auth.config";
import { AdminSaasRepository } from "./admin-saas.repository";
import { 
  PlanForm, 
  AssignPlan, 
  UpdateOrganizationStatus 
} from "./admin-saas.schema";
import { RolGlobal } from "@prisma/client";

export class AdminSaasService {
  private repository: AdminSaasRepository;

  constructor() {
    this.repository = new AdminSaasRepository();
  }

  private async ensureAdmin() {
    const session = await getServerSession(authOptions);
    const rolGlobal = (session?.user as any)?.rolGlobal;
    
    if (rolGlobal !== RolGlobal.SUPERADMIN && rolGlobal !== RolGlobal.ADMIN_SAAS) {
      throw new Error("Acceso denegado. Se requiere rol de administrador global.");
    }
    return session;
  }

  async getDashboardKPIs() {
    await this.ensureAdmin();
    return this.repository.getDashboardKPIs();
  }

  async listOrganizations() {
    await this.ensureAdmin();
    return this.repository.listOrganizations();
  }

  async getOrganizationDetail(id: string) {
    await this.ensureAdmin();
    return this.repository.getOrganizationDetail(id);
  }

  async updateOrganizationStatus(data: UpdateOrganizationStatus) {
    await this.ensureAdmin();
    return this.repository.updateOrganizationStatus(data);
  }

  async assignPlan(data: AssignPlan) {
    await this.ensureAdmin();
    return this.repository.assignPlan(data);
  }

  async listUsers() {
    await this.ensureAdmin();
    return this.repository.listUsers();
  }

  async listPlans() {
    await this.ensureAdmin();
    return this.repository.listPlans();
  }

  async upsertPlan(data: PlanForm) {
    await this.ensureAdmin();
    return this.repository.upsertPlan(data);
  }

  async deletePlan(id: string) {
    await this.ensureAdmin();
    return this.repository.deletePlan(id);
  }
}
