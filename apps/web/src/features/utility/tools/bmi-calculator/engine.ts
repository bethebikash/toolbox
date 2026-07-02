export type Unit = 'metric' | 'imperial';

export interface BMIResult {
  bmi:        number;
  category:   string;
  color:      string;
  idealMin:   number;
  idealMax:   number;
  description: string;
}

export function calculateBMI(weight: number, height: number, unit: Unit): BMIResult {
  let bmi: number;
  let idealMin: number;
  let idealMax: number;

  if (unit === 'metric') {
    const hm = height / 100;
    bmi      = weight / (hm * hm);
    idealMin = 18.5 * hm * hm;
    idealMax = 24.9 * hm * hm;
  } else {
    bmi      = (weight / (height * height)) * 703;
    idealMin = (18.5 * height * height) / 703;
    idealMax = (24.9 * height * height) / 703;
  }

  const { category, color, description } = classify(bmi);
  return { bmi: Math.round(bmi * 10) / 10, category, color, idealMin: Math.round(idealMin * 10) / 10, idealMax: Math.round(idealMax * 10) / 10, description };
}

function classify(bmi: number): { category: string; color: string; description: string } {
  if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6', description: 'BMI is below the healthy range.' };
  if (bmi < 25)   return { category: 'Normal weight', color: '#10B981', description: 'BMI is within the healthy range.' };
  if (bmi < 30)   return { category: 'Overweight', color: '#D97706', description: 'BMI is above the healthy range.' };
  if (bmi < 35)   return { category: 'Obese (Class I)', color: '#EF4444', description: 'BMI indicates moderate obesity.' };
  if (bmi < 40)   return { category: 'Obese (Class II)', color: '#DC2626', description: 'BMI indicates severe obesity.' };
  return { category: 'Obese (Class III)', color: '#991B1B', description: 'BMI indicates very severe obesity.' };
}

export const meta = { ready: true };
