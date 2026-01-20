import { expect, test, describe } from 'vitest';
import { calculateBMI, getBMICategory } from './bmi';

describe('BMI Utils', () => {
  describe('calculateBMI', () => {
    test('should calculate BMI correctly for standard values', () => {
      // 70kg, 1.75m -> 22.86
      expect(calculateBMI(70, 1.75)).toBe(22.86);
    });

    test('should throw error for invalid height', () => {
      expect(() => calculateBMI(70, 0)).toThrow('Height must be greater than 0');
      expect(() => calculateBMI(70, -1)).toThrow('Height must be greater than 0');
    });

    test('should throw error for invalid weight', () => {
        expect(() => calculateBMI(0, 1.75)).toThrow('Weight must be greater than 0');
    });
  });

  describe('getBMICategory', () => {
    test('should return Underweight for BMI < 18.5', () => {
      expect(getBMICategory(18.4)).toBe('Underweight');
    });

    test('should return Normal weight for 18.5 <= BMI < 25', () => {
      expect(getBMICategory(18.5)).toBe('Normal weight');
      expect(getBMICategory(24.9)).toBe('Normal weight');
    });

    test('should return Overweight for 25 <= BMI < 30', () => {
      expect(getBMICategory(25)).toBe('Overweight');
      expect(getBMICategory(29.9)).toBe('Overweight');
    });

    test('should return Obese for BMI >= 30', () => {
      expect(getBMICategory(30)).toBe('Obese');
      expect(getBMICategory(40)).toBe('Obese');
    });
  });
});
