import { notFound } from "next/navigation";
import { getTenantId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCompraById } from "@/modules/compras/server/compra.service";
import { CompraForm } from "@/modules/compras/ui/compra-form";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "Editar Compra — RetenSaaS",
};

export default async function EditarCompraPage({ params }: Props) {
  const tenantId = await getTenantId();
  const compra = await getCompraById(params.id, tenantId);

  if (!compra) notFound();

  const periodoCerrado = compra.periodoFiscal.estado === "CERRADO";

  const [empresas, proveedores, tiposDocumento, alicuotas, comprasDisponibles] =
    await Promise.all([
      prisma.empresa.findMany({
        where: { tenantId, deletedAt: null },
        select: { id: true, nombreFiscal: true },
        orderBy: { nombreFiscal: "asc" },
      }),
      prisma.proveedor.findMany({
        where: { tenantId, deletedAt: null },
        select: { id: true, nombre: true, rif: true, empresaId: true },
        orderBy: { nombre: "asc" },
      }),
      prisma.tipoDocumento.findMany({
        select: { id: true, codigo: true, descripcion: true },
        orderBy: { codigo: "asc" },
      }),
      prisma.alicuotaIVA.findMany({
        where: { activa: true },
        select: { id: true, nombre: true, porcentaje: true },
        orderBy: { porcentaje: "desc" },
      }),
      // Compras disponibles para documentoAfectadoId (del mismo tenant, excluye la actual)
      prisma.compra.findMany({
        where: {
          tenantId,
          empresaId: compra.empresaId,
          id: { not: params.id },
        },
        select: {
          id: true,
          numeroFactura: true,
          tipoDocumento: { select: { codigo: true } },
        },
        orderBy: { fechaFactura: "desc" },
        take: 100,
      }),
    ]);

  // Mapear los datos de la compra al formato del formulario
  const initialData = {
    id: compra.id,
    empresaId: compra.empresaId,
    proveedorId: compra.proveedorId,
    tipoDocumentoId: compra.tipoDocumentoId,
    tipoDocumentoCodigo: compra.tipoDocumento.codigo,
    documentoAfectadoId: compra.documentoAfectadoId,
    numeroFactura: compra.numeroFactura || "",
    numeroControl: compra.numeroControl || "",
    fechaFactura: compra.fechaFactura.toISOString().slice(0, 10),
    porcentajeAlicuotaSnapshot: compra.porcentajeAlicuotaSnapshot ? Number(compra.porcentajeAlicuotaSnapshot) : null,
    montoExento: Number(compra.montoExento),
    montoBase: Number(compra.montoBase),
    impuestoIVA: Number(compra.impuestoIVA),
    totalFactura: Number(compra.totalFactura),
    tipoAjuste: (compra.tipoAjuste as any) ?? null,
    motivoAjuste: compra.motivoAjuste || "",
    // Campos fiscales IVA extendidos
    naturalezaIVA: compra.naturalezaIVA,
    esViatico: compra.esViatico,
    esGastoReembolsable: compra.esGastoReembolsable,
    esServicioPublicoDomiciliario: compra.esServicioPublicoDomiciliario,
    esOperacionArticulo2RetencionTotal: compra.esOperacionArticulo2RetencionTotal,
    tienePercepcionAnticipadaIVA: compra.tienePercepcionAnticipadaIVA,
    ivaDiscriminado: compra.ivaDiscriminado,
    cumpleRequisitosFormales: compra.cumpleRequisitosFormales,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Editar Compra</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Período asociado:{" "}
          <span className="font-mono font-medium">
            {compra.periodoFiscal.codigoPeriodo}
          </span>
          {periodoCerrado && (
            <span className="ml-2 text-red-600 font-medium">(cerrado)</span>
          )}
        </p>
      </div>

      <CompraForm
        initialData={initialData}
        empresas={empresas}
        proveedores={proveedores}
        tiposDocumento={tiposDocumento}
        alicuotas={alicuotas as any}
        comprasDisponibles={comprasDisponibles}
        periodosCerrados={periodoCerrado}
      />
    </div>
  );
}
