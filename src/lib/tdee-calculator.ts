/**
 * TDEE SOP Calculator (Mifflin-St Jeor Equation)
 * Data-First Rule strictly adhered to UserProfile attributes inside gemini.md.
 */

export interface UserMetrics {
  age: number;
  gender: 'male' | 'female' | string;
  weight_kg: number;
  height_cm: number;
  activity_level: 'sedentary' | 'lightly' | 'moderately' | 'very' | 'extra';
  goal: 'lose' | 'maintain' | 'gain';
}

export function calculateBMR(metrics: Omit<UserMetrics, 'activity_level' | 'goal'>): number {
  const { weight_kg, height_cm, age, gender } = metrics;
  
  let bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  if (gender.toLowerCase() === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  
  return bmr;
}

export function calculateTDEE(metrics: UserMetrics): number {
  const bmr = calculateBMR(metrics);
  const multipliers: Record<string, number> = {
    'sedentary': 1.2,
    'lightly': 1.375,
    'moderately': 1.55,
    'very': 1.725,
    'extra': 1.9
  };

  const activityLevelStr = metrics.activity_level.toLowerCase();
  
  // Find matching multiplier, default to sedentary if completely unknown
  const multiplierKey = Object.keys(multipliers).find(k => activityLevelStr.includes(k)) || 'sedentary';
  
  return Math.round(bmr * multipliers[multiplierKey]);
}

export function calculateDailyCalorieTarget(tdee: number, goal: 'lose' | 'maintain' | 'gain'): number {
  if (goal === 'lose') return tdee - 500;
  if (goal === 'gain') return tdee + 500;
  return tdee;
}

export function sumCaloriesAndMacros(foodItems: { calories: number; protein: number; carbs: number; fat: number }[]) {
  return foodItems.reduce((acc, item) => {
    acc.calories += item.calories;
    acc.protein += item.protein;
    acc.carbs += item.carbs;
    acc.fat += item.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

export function distributeTargetMacros(totalCalories: number) {
  // Default: 30% Protein, 40% Carbs, 30% Fat as defined in Project Constitution
  // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
  return {
    protein_g: Math.round((totalCalories * 0.3) / 4),
    carbs_g: Math.round((totalCalories * 0.4) / 4),
    fat_g: Math.round((totalCalories * 0.3) / 9)
  };
}
