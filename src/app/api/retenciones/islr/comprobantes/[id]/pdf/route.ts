import { NextRequest, NextResponse } from "next/server";
import { getTenantId, requireAuth } from "@/lib/auth";
import { generarComprobanteISLRPdf } from "@/modules/retenciones/islr/pdf/server/comprobante-islr-pdf.service";

/**
 * Endpoint para descargar el comprobante ISLR en formato PDF.
 */

export async function GET(
  req: any, // NextRequest type issues sometimes in certain environments
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validar autenticación
    await requireAuth();
    const tenantId = await getTenantId();

    if (!params.id) {
      return new NextResponse("ID de comprobante requerido", { status: 400 });
    }

    // 2. Generar PDF
    const { buffer, numeroComprobante, rifEmpresa } = await generarComprobanteISLRPdf(params.id, tenantId);

    // 3. Devolver respuesta con los headers correctos para descarga
    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="comprobante_islr_${numeroComprobante}_${rifEmpresa}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("[COMPROBANTE_ISLR_PDF_ERROR]", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Error al generar el PDF" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
