import { getEmpresaActiva } from "@/lib/data";

export default async function PagosPlaceholder() {
  const empresaActiva = await getEmpresaActiva();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Pagos</h1>
      <p className="text-zinc-500">Módulo en construcción. Aquí podrás registrar y conciliar los pagos a proveedores.</p>
      
      <div className="bg-white p-6 rounded-xl border border-zinc-200">
        <h2 className="text-lg font-medium text-zinc-900">Contexto actual</h2>
        <p className="text-zinc-600 mt-2">
          Empresa activa: <strong>{empresaActiva?.nombreFiscal || "Ninguna"}</strong>
        </p>
      </div>
    </div>
  );
}
