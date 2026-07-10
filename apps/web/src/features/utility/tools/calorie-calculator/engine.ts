export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
export type Goal = 'lose' | 'maintain' | 'gain';

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary:    'Sedentary (little or no exercise)',
  light:        'Lightly active (1-3 days/week)',
  moderate:     'Moderately active (3-5 days/week)',
  active:       'Very active (6-7 days/week)',
  'very-active':'Extra active (twice a day)',
};

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, 'very-active': 1.9,
};

export interface CalorieOptions {
  weight:   number;  // kg
  height:   number;  // cm
  age:      number;
  sex:      'male' | 'female';
  activity: ActivityLevel;
  goal:     Goal;
  unit:     'metric' | 'imperial';
}

export interface CalorieResult {
  bmr:        number;
  tdee:       number;
  target:     number;
  protein:    number;  // grams
  carbs:      number;
  fat:        number;
  bmi:        number;
  bmiCategory:string;
}

export function calculateCalories(opts: CalorieOptions): CalorieResult {
  let { weight, height } = opts;

  if (opts.unit === 'imperial') {
    weight = weight * 0.453592;
    height = height * 2.54;
  }

  // Mifflin-St Jeor BMR
  const bmr = opts.sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * opts.age + 5
    : 10 * weight + 6.25 * height - 5 * opts.age - 161;

  const tdee = bmr * ACTIVITY_MULTIPLIERS[opts.activity];

  const target = opts.goal === 'lose'     ? tdee - 500
               : opts.goal === 'gain'     ? tdee + 300
               : tdee;

  const protein = Math.round(weight * 2.2);
  const fat     = Math.round(target * 0.25 / 9);
  const carbs   = Math.round((target - protein * 4 - fat * 9) / 4);

  const hm  = height / 100;
  const bmi = Math.round((weight / (hm * hm)) * 10) / 10;
  const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(target), protein, carbs, fat, bmi, bmiCategory };
}

export const meta = { ready: true };
