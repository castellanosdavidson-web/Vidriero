import { useState, useEffect } from 'react';

export type Unit = 'CM' | 'M';

export interface CalculatorInputs {
  height: number;
  width: number;
  unit: Unit;
  pricePerM2: number;
  requiresInstall: boolean;
  baseInstallPrice?: number;
  installPricePerM2?: number;
  surcharges?: number;
  minArea?: number;
  hardwarePrice?: number;
}

export interface CalculatorOutputs {
  rawAreaM2: number; // Área real para display
  areaM2: number; // Área a cobrar
  basePrice: number;
  installationPrice: number;
  hardwarePrice: number;
  totalPrice: number;
}

export function useCalculator(inputs: CalculatorInputs): CalculatorOutputs {
  const [outputs, setOutputs] = useState<CalculatorOutputs>({
    rawAreaM2: 0,
    areaM2: 0,
    basePrice: 0,
    installationPrice: 0,
    hardwarePrice: 0,
    totalPrice: 0,
  });

  useEffect(() => {
    // 1. Calculate Area in M2
    let rawAreaM2 = 0;
    if (inputs.unit === 'CM') {
      rawAreaM2 = (inputs.height / 100) * (inputs.width / 100);
    } else {
      rawAreaM2 = inputs.height * inputs.width;
    }

    // 2. Regla de Volumen Mínimo
    const minArea = inputs.minArea || 0.30;
    const areaM2 = Math.max(rawAreaM2, minArea);

    // 3. Base Price
    const basePrice = areaM2 * inputs.pricePerM2;

    // 4. Installation Price
    let installationPrice = 0;
    if (inputs.requiresInstall) {
      installationPrice = (inputs.baseInstallPrice || 0) + (areaM2 * (inputs.installPricePerM2 || 0));
    }

    // 5. Herrajes (Fijo)
    const hardwarePrice = inputs.hardwarePrice || 0;

    // 6. Total Price
    const totalPrice = basePrice + installationPrice + hardwarePrice + (inputs.surcharges || 0);

    setOutputs({
      rawAreaM2,
      areaM2,
      basePrice,
      installationPrice,
      hardwarePrice,
      totalPrice,
    });
  }, [inputs]);

  return outputs;
}
