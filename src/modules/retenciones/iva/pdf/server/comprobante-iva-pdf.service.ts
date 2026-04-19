import puppeteer from 'puppeteer';
import { prisma } from '@/lib/prisma';
import { ComprobanteIVAPdfTemplate } from './comprobante-iva-pdf.template';
import React from 'react';

export async function generarComprobanteIVAPdf(comprobanteId: string, tenantId: string) {
  // Importar dinámicamente para evitar errores en el bundler de Next.js
  const { renderToStaticMarkup } = await import('react-dom/server');
  // 1. Cargar datos con todas las relaciones necesarias
  const comprobante = await prisma.comprobanteIVA.findFirst({
    where: {
      id: comprobanteId,
      tenantId: tenantId,
    },
    include: {
      empresa: true,
      proveedor: true,
      retencionesIVA: {
        include: {
          compra: {
            include: {
              tipoDocumento: true,
              documentoAfectado: true,
            }
          },
          periodoFiscal: true,
        }
      }
    }
  });

  if (!comprobante) {
    throw new Error("Comprobante no encontrado o no pertenece al tenant");
  }

  // 2. Renderizar template a HTML
  const htmlContent = renderToStaticMarkup(
    React.createElement(ComprobanteIVAPdfTemplate, { data: comprobante })
  );

  // HTML completo con estilos base para asegurar que Puppeteer lo renderice bien
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
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
  
  // Media carta horizontal: 21.59cm 13.97cm
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
