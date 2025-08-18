/**
 * Security utilities for data validation and sanitization
 */

// Content Security Policy - allowed characters for questions and labels
const SAFE_TEXT_PATTERN = /^[a-zA-Z0-9\s\-_.,!?()'":/\[\]@#%&+=]*$/;
const MAX_TEXT_LENGTH = 2000;
const MAX_OPTION_LENGTH = 100;
const MAX_SECTION_LENGTH = 100;

// File size limits
export const MAX_CSV_SIZE = 1024 * 1024; // 1MB
export const MAX_QUESTIONS_COUNT = 200;

/**
 * Sanitizes text input to prevent XSS and injection attacks
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, (char) => { // Escape dangerous characters
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[char] || char;
    })
    .slice(0, MAX_TEXT_LENGTH);
}

/**
 * Validates that text content is safe and doesn't contain suspicious patterns
 */
export function validateSafeText(text: string, maxLength: number = MAX_TEXT_LENGTH): boolean {
  if (!text || typeof text !== 'string') return false;
  if (text.length > maxLength) return false;
  
  // Check for basic script injection patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(text)) && 
         SAFE_TEXT_PATTERN.test(text);
}

/**
 * Validates CSV file before processing
 */
export function validateCsvFile(csvContent: string): { isValid: boolean; error?: string } {
  if (!csvContent || typeof csvContent !== 'string') {
    return { isValid: false, error: 'Invalid CSV content' };
  }
  
  if (csvContent.length > MAX_CSV_SIZE) {
    return { isValid: false, error: 'CSV file too large (max 1MB)' };
  }
  
  // Count approximate lines to prevent DoS
  const lineCount = csvContent.split('\n').length;
  if (lineCount > MAX_QUESTIONS_COUNT + 10) { // +10 for headers and empty lines
    return { isValid: false, error: `Too many lines (max ${MAX_QUESTIONS_COUNT} questions)` };
  }
  
  // Check for basic CSV structure
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    return { isValid: false, error: 'CSV must contain header and at least one question' };
  }
  
  return { isValid: true };
}

/**
 * Validates and sanitizes survey question data
 */
export function validateQuestionData(question: any): { isValid: boolean; error?: string; sanitized?: any } {
  if (!question || typeof question !== 'object') {
    return { isValid: false, error: 'Invalid question object' };
  }
  
  // Validate required fields
  const label = sanitizeText(question.label || '');
  const section = sanitizeText(question.section || '');
  const key = sanitizeText(question.key || '');
  
  if (!validateSafeText(label)) {
    return { isValid: false, error: 'Invalid question label' };
  }
  
  if (!validateSafeText(section, MAX_SECTION_LENGTH)) {
    return { isValid: false, error: 'Invalid section name' };
  }
  
  if (!validateSafeText(key, 50)) {
    return { isValid: false, error: 'Invalid question key' };
  }
  
  // Validate question type
  const validTypes = ['text', 'textarea', 'radio', 'yesno', 'number'];
  const type = String(question.type || '').toLowerCase().trim();
  if (!validTypes.includes(type)) {
    return { isValid: false, error: 'Invalid question type' };
  }
  
  // Validate options if present
  let sanitizedOptions: string[] | undefined;
  if (question.options) {
    const options = Array.isArray(question.options) 
      ? question.options 
      : String(question.options).split('|');
    
    sanitizedOptions = options
      .map(opt => sanitizeText(String(opt)))
      .filter(opt => validateSafeText(opt, MAX_OPTION_LENGTH));
    
    if (options.length > 0 && sanitizedOptions.length === 0) {
      return { isValid: false, error: 'No valid options provided' };
    }
    
    if (sanitizedOptions.length > 20) {
      return { isValid: false, error: 'Too many options (max 20)' };
    }
  }
  
  return {
    isValid: true,
    sanitized: {
      ...question,
      label,
      section,
      key,
      type,
      options: sanitizedOptions,
      placeholder: question.placeholder ? sanitizeText(question.placeholder) : undefined,
      help: question.help ? sanitizeText(question.help) : undefined
    }
  };
}

/**
 * Securely stores data in localStorage with basic obfuscation
 */
export function secureLocalStorage(key: string, data: string): void {
  try {
    // Basic obfuscation (not encryption, but better than plain text)
    const obfuscated = btoa(encodeURIComponent(data));
    localStorage.setItem(`secure_${key}`, obfuscated);
  } catch (error) {
    console.warn('Failed to store data securely:', error);
    throw new Error('Storage operation failed');
  }
}

/**
 * Retrieves and deobfuscates data from localStorage
 */
export function getSecureLocalStorage(key: string): string | null {
  try {
    const stored = localStorage.getItem(`secure_${key}`);
    if (!stored) return null;
    
    return decodeURIComponent(atob(stored));
  } catch (error) {
    console.warn('Failed to retrieve secure data:', error);
    return null;
  }
}

/**
 * Validates external URL to prevent SSRF attacks
 */
export function validateExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTPS
    if (parsed.protocol !== 'https:') return false;
    
    // Only allow Google Sheets domains
    const allowedDomains = ['docs.google.com', 'sheets.googleapis.com'];
    if (!allowedDomains.includes(parsed.hostname)) return false;
    
    // Prevent localhost/internal network access
    if (parsed.hostname === 'localhost' || 
        parsed.hostname.startsWith('127.') ||
        parsed.hostname.startsWith('10.') ||
        parsed.hostname.startsWith('192.168.') ||
        parsed.hostname.startsWith('172.')) return false;
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limiting for external requests
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests = 10;
  private readonly windowMs = 60000; // 1 minute
  
  canMakeRequest(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();