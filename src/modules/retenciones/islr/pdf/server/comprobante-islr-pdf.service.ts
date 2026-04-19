import puppeteer from 'puppeteer';
import { prisma } from '@/lib/prisma';
import { ComprobanteISLRPdfTemplate } from './comprobante-islr-pdf.template';
import React from 'react';

/**
 * Servicio server-side para generar PDF de comprobantes ISLR.
 */

export async function generarComprobanteISLRPdf(comprobanteId: string, tenantId: string) {
  // Importar dinámicamente para evitar problemas de Next.js SSR en este contexto
  const { renderToStaticMarkup } = await import('react-dom/server');

  // 1. Cargar datos
  const comprobante = await prisma.comprobanteISLR.findFirst({
    where: {
      id: comprobanteId,
      tenantId: tenantId,
    },
    include: {
      empresa: true,
      proveedor: true,
      periodoFiscal: true,
      retencionesISLR: {
        include: {
          pago: {
            include: {
              pagoCompras: {
                include: {
                  compra: {
                    include: {
                      tipoDocumento: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!comprobante) {
    throw new Error("Comprobante ISLR no encontrado o no pertenece al tenant.");
  }

  // 2. Renderizar template a HTML
  const htmlContent = renderToStaticMarkup(
    React.createElement(ComprobanteISLRPdfTemplate, { data: comprobante })
  );

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  // 3. Generar PDF con Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  
  // Media carta horizontal: 21.59cm x 13.97cm
  const pdfBuffer = await page.pdf({
    width: '21.59cm',
    height: '13.97cm',
    printBackground: true,
    margin: {
      top: '0cm',
      bottom: '0cm',
      left: '0cm',
      right: '0cm'
    }
  });

  await browser.close();

  return {
    buffer: pdfBuffer,
    numeroComprobante: comprobante.numeroComprobante,
    rifEmpresa: comprobante.empresa.rif
  };
}
