export function calculateBMI(weight: number, height: number): number {
  if (height <= 0) {
    throw new Error('Height must be greater than 0');
  }
  if (weight <= 0) {
      throw new Error('Weight must be greater than 0');
  }
  
  // BMI = kg / m^2
  const bmi = weight / (height * height);
  
  // Return rounded to 2 decimal places
  return parseFloat(bmi.toFixed(2));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
