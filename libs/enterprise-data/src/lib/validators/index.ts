// Data validators
// Add your validation logic here

export class UserValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 50;
  }
}
