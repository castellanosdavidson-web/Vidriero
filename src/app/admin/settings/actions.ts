'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteInstallationRule(formData: FormData) {
  const id = formData.get('id') as string;
  
  if (!id) return;

  await prisma.installationRule.delete({
    where: { id }
  });

  revalidatePath('/admin/settings');
}

export async function saveInstallationRule(formData: FormData) {
  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const basePrice = parseFloat(formData.get('basePrice') as string) || 0;
  const pricePerM2 = parseFloat(formData.get('pricePerM2') as string) || 0;
  const isActive = formData.get('isActive') === 'true';

  try {
    if (id && id !== 'new') {
      await prisma.installationRule.update({
        where: { id },
        data: { name, description, basePrice, pricePerM2, isActive }
      });
    } else {
      await prisma.installationRule.create({
        data: { name, description, basePrice, pricePerM2, isActive }
      });
    }
  } catch (error) {
    console.error('Error saving InstallationRule:', error);
    throw new Error('Error al guardar la regla de instalación');
  }

  revalidatePath('/admin/settings');
  redirect('/admin/settings');
}

export async function saveWhatsAppNumber(formData: FormData) {
  const number = formData.get('whatsappNumber') as string;
  
  if (!number) return;

  try {
    await prisma.setting.upsert({
      where: { key: 'WHATSAPP_NUMBER' },
      update: { value: number },
      create: { key: 'WHATSAPP_NUMBER', value: number, description: 'Número de WhatsApp principal para notificaciones' }
    });
  } catch (error) {
    console.error('Error saving whatsapp number:', error);
  }

  revalidatePath('/admin/settings');
  revalidatePath('/cotizacion/comprobante/[id]', 'page');
}
