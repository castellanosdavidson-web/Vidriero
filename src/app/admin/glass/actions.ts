'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteGlassType(formData: FormData) {
  const id = formData.get('id') as string;
  
  if (!id) return;

  try {
    await prisma.glassType.delete({
      where: { id }
    });
  } catch (error) {
    // Si falla por dependencias (ej. tiene cotizaciones), lo desactivamos
    await prisma.glassType.update({
      where: { id },
      data: { isActive: false }
    });
  }

  revalidatePath('/admin/glass');
}

export async function saveGlassType(formData: FormData) {
  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const category = formData.get('category') as string;
  const pricePerM2 = parseFloat(formData.get('pricePerM2') as string);
  const minArea = parseFloat(formData.get('minArea') as string || '0.30');
  const productType = formData.get('productType') as string || 'MATERIAL';
  const hardwareOptions = formData.get('hardwareOptions') as string || '[]';
  const isActive = formData.get('isActive') === 'true';
  
  // En Next.js app router FormData para arrays puede ser engañoso.
  // Vamos a usar campos de texto ocultos o parsear el string JSON directamente del frontend.
  const thicknesses = formData.get('thicknesses') as string; // Expecting '["4mm","6mm"]'
  const colors = formData.get('colors') as string; // Expecting '["Claro"]'

  try {
    if (id && id !== 'new') {
      await prisma.glassType.update({
        where: { id },
        data: {
          name,
          description,
          imageUrl: imageUrl || null,
          category,
          productType,
          pricePerM2,
          minArea,
          thicknesses,
          colors,
          hardwareOptions,
          isActive
        }
      });
    } else {
      await prisma.glassType.create({
        data: {
          name,
          description,
          imageUrl: imageUrl || null,
          category,
          productType,
          pricePerM2,
          minArea,
          thicknesses,
          colors,
          hardwareOptions,
          isActive
        }
      });
    }
  } catch (error) {
    console.error('Error saving GlassType:', error);
    throw new Error('Error al guardar el tipo de vidrio');
  }

  revalidatePath('/admin/glass');
  redirect('/admin/glass');
}
