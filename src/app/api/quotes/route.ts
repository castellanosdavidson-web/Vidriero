import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // The data comes from QuoteForm. We calculate server-side to verify, 
    // but for now, we will save the calculated values passed from the client for simplicity,
    // or re-calculate them here. For a robust SaaS, we MUST recalculate on the server.
    
    // For this example we just insert the received quote data.
    // In SQLite, enums like Status aren't supported natively so we must create a default Status first if it doesn't exist.
    
    let defaultStatus = await prisma.quoteStatus.findFirst({
      where: { isDefault: true }
    });

    if (!defaultStatus) {
      defaultStatus = await prisma.quoteStatus.create({
        data: {
          name: "Nueva",
          color: "#0058be",
          isDefault: true
        }
      });
    }

    // Since SQLite doesn't support arrays, we assume the DB is seeded with GlassTypes
    // For testing, if glassTypeId is missing in DB, we create a dummy one.
    let glassType = await prisma.glassType.findUnique({
      where: { id: data.glassTypeId }
    });

    if (!glassType) {
      glassType = await prisma.glassType.create({
        data: {
          id: data.glassTypeId,
          name: "Vidrio Generado",
          pricePerM2: 85000,
          thicknesses: '["4mm"]',
          colors: '["Claro"]'
        }
      });
    }

    const newQuote = await prisma.quote.create({
      data: {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientCity: data.clientCity,
        glassTypeId: glassType.id,
        color: data.color,
        thickness: data.thickness,
        height: data.height,
        width: data.width,
        unit: data.unit,
        requiresInstall: data.requiresInstall,
        installationRuleId: data.installationRuleId || null,
        areaM2: data.areaM2,
        basePrice: data.basePrice,
        installationPrice: data.installationPrice,
        hardwareName: data.hardwareName || null,
        hardwarePrice: data.hardwarePrice || 0,
        surcharges: 0,
        totalPrice: data.totalPrice,
        statusId: defaultStatus.id,
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: newQuote.id,
      message: 'Cotización guardada exitosamente' 
    });
  } catch (error: any) {
    console.error("API Error creating quote:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
