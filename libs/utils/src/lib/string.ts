/**
 * String manipulation utilities
 */

/**
 * Truncate string to max length
 * @example truncate('Hello World', 5) => 'Hello...'
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert string to slug (URL-friendly)
 * @example slugify('Hello World!') => 'hello-world'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Capitalize first letter
 * @example capitalize('hello') => 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize each word
 * @example capitalizeWords('hello world') => 'Hello World'
 */
export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Convert camelCase to kebab-case
 * @example camelToKebab('helloWorld') => 'hello-world'
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 * @example kebabToCamel('hello-world') => 'helloWorld'
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Sanitize HTML (remove tags)
 * @example sanitizeHtml('<script>alert("xss")</script>') => ''
 */
export function sanitizeHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Extract initials from name
 * @example getInitials('John Doe') => 'JD'
 */
export function getInitials(name: string, maxLength = 2): string {
  return name
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('');
}

/**
 * Generate random string
 * @example randomString(8) => 'a3Bc9fGh'
 */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if string is empty or whitespace
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Mask sensitive data (e.g., email, phone)
 * @example maskString('user@example.com', 4) => 'user****ple.com'
 */
export function maskString(str: string, visibleChars = 3, maskChar = '*'): string {
  if (str.length <= visibleChars * 2) return str;
  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars * 2);
  return start + masked + end;
}

