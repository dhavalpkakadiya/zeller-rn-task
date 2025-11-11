/**
 * Validation utility tests
 * Tests for form validation logic
 */

describe('Validation Functions', () => {
  // These validation functions are currently inside UserModal component
  // We'll test them through the component, but let's create testable versions

  const validateName = (name: string): string | undefined => {
    if (!name || name.trim().length === 0) {
      return 'Name should not be empty';
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return 'Name cannot contain special characters (only alphabets and spaces allowed)';
    }
    return undefined;
  };

  const validateFullName = (
    first: string,
    last: string,
  ): string | undefined => {
    const fullName = `${first} ${last}`.trim();
    if (fullName.length > 50) {
      return 'Name must not exceed 50 characters';
    }
    return undefined;
  };

  const validateEmail = (emailValue: string): string | undefined => {
    if (!emailValue || emailValue.trim().length === 0) {
      return undefined;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      return 'Email must be in valid format';
    }
    return undefined;
  };

  describe('validateName', () => {
    it('should return error for empty name', () => {
      expect(validateName('')).toBe('Name should not be empty');
      expect(validateName('   ')).toBe('Name should not be empty');
    });

    it('should return error for null or undefined', () => {
      expect(validateName(null as any)).toBe('Name should not be empty');
      expect(validateName(undefined as any)).toBe('Name should not be empty');
    });

    it('should return error for names with special characters', () => {
      expect(validateName('John123')).toBeDefined();
      expect(validateName('John@Doe')).toBeDefined();
      expect(validateName('John-Doe')).toBeDefined();
      expect(validateName('John_Doe')).toBeDefined();
      expect(validateName('John.Doe')).toBeDefined();
    });

    it('should pass for valid names with only alphabets and spaces', () => {
      expect(validateName('John')).toBeUndefined();
      expect(validateName('John Doe')).toBeUndefined();
      expect(validateName('Mary Jane Watson')).toBeUndefined();
      expect(validateName("O'Connor")).toBeDefined(); // Apostrophe is special char
    });

    it('should handle names with multiple spaces', () => {
      expect(validateName('John  Doe')).toBeUndefined();
    });
  });

  describe('validateFullName', () => {
    it('should return error when full name exceeds 50 characters', () => {
      const longFirstName = 'A'.repeat(30);
      const longLastName = 'B'.repeat(25);
      expect(validateFullName(longFirstName, longLastName)).toBe(
        'Name must not exceed 50 characters',
      );
    });

    it('should pass when full name is exactly 50 characters', () => {
      const firstName = 'A'.repeat(25);
      const lastName = 'B'.repeat(24); // 25 + 1 space + 24 = 50
      expect(validateFullName(firstName, lastName)).toBeUndefined();
    });

    it('should pass when full name is less than 50 characters', () => {
      expect(validateFullName('John', 'Doe')).toBeUndefined();
      expect(validateFullName('Mary', 'Jane Watson')).toBeUndefined();
    });

    it('should handle empty strings', () => {
      expect(validateFullName('', '')).toBeUndefined();
      expect(validateFullName('John', '')).toBeUndefined();
    });
  });

  describe('validateEmail', () => {
    it('should return undefined for empty email (optional field)', () => {
      expect(validateEmail('')).toBeUndefined();
      expect(validateEmail('   ')).toBeUndefined();
    });

    it('should return error for invalid email formats', () => {
      expect(validateEmail('invalid')).toBe('Email must be in valid format');
      expect(validateEmail('invalid@')).toBe('Email must be in valid format');
      expect(validateEmail('@invalid.com')).toBe(
        'Email must be in valid format',
      );
      expect(validateEmail('invalid@com')).toBe(
        'Email must be in valid format',
      );
      expect(validateEmail('invalid.com')).toBe(
        'Email must be in valid format',
      );
      expect(validateEmail('invalid @example.com')).toBe(
        'Email must be in valid format',
      );
    });

    it('should pass for valid email formats', () => {
      expect(validateEmail('test@example.com')).toBeUndefined();
      expect(validateEmail('user.name@example.com')).toBeUndefined();
      expect(validateEmail('user+tag@example.co.uk')).toBeUndefined();
      expect(validateEmail('user_123@example-domain.com')).toBeUndefined();
    });

    it('should handle edge cases', () => {
      expect(validateEmail('a@b.c')).toBeUndefined(); // Minimal valid email
      expect(validateEmail('test@example')).toBe(
        'Email must be in valid format',
      );
    });
  });
});
