export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (
  value: string,
  minLength: number,
): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (
  value: string,
  maxLength: number,
): boolean => {
  return value.trim().length <= maxLength;
};

export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

export const validateNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

export const validatePositiveNumber = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const validateRange = (
  value: number,
  min: number,
  max: number,
): boolean => {
  return value >= min && value <= max;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const combineValidations = (
  value: string,
  validators: Array<{ validate: (v: string) => boolean; message: string }>,
): ValidationResult => {
  const errors: string[] = [];

  validators.forEach(({ validate, message }) => {
    if (!validate(value)) {
      errors.push(message);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
