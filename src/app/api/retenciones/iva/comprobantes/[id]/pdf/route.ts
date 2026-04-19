import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/server/auth.config";
import { generarComprobanteIVAPdf } from "@/modules/retenciones/iva/pdf/server/comprobante-iva-pdf.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const tenantId = (session?.user as any)?.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;
    
    const { buffer, numeroComprobante, rifEmpresa } = await generarComprobanteIVAPdf(id, tenantId);

    // Limpiar el RIF y Número de Comprobante para el nombre del archivo
    const rifClean = (rifEmpresa || "").replace(/[^a-zA-Z0-9]/g, "");
    const numeroClean = (numeroComprobante || "").replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `comprobante_iva_${rifClean}_${numeroClean}.pdf`;

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error("Error generando PDF:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al generar PDF" },
      { status: 500 }
    );
  }
}
