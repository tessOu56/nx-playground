/**
 * Unified Logger for Nx Monorepo
 *
 * Features:
 * - Structured logging (JSON format)
 * - Log levels (debug, info, warn, error, fatal)
 * - Environment-aware (dev vs prod)
 * - Context injection
 * - Browser + Node.js compatible
 */

import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  userId?: string;
  requestId?: string;
  sessionId?: string;
  [key: string]: unknown;
}

export interface LoggerConfig {
  level?: LogLevel;
  name?: string;
  enabled?: boolean;
  prettyPrint?: boolean;
}

class Logger {
  private pinoLogger: PinoLogger;
  private context: LogContext = {};

  constructor(config: LoggerConfig = {}) {
    const {
      level = this.getDefaultLevel(),
      name = 'nx-playground',
      enabled = true,
      prettyPrint = this.isDevelopment(),
    } = config;

    const pinoConfig: LoggerOptions = {
      name,
      level: enabled ? level : 'silent',
      browser: this.isBrowser() ? { asObject: true } : undefined,
    };

    // Add pretty printing for development
    if (prettyPrint && !this.isBrowser()) {
      this.pinoLogger = pino({
        ...pinoConfig,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      });
    } else {
      this.pinoLogger = pino(pinoConfig);
    }
  }

  /**
   * Set persistent context for all logs
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clear all context
   */
  clearContext(): void {
    this.context = {};
  }

  /**
   * Get current context
   */
  getContext(): LogContext {
    return { ...this.context };
  }

  /**
   * Create child logger with additional context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger();
    childLogger.pinoLogger = this.pinoLogger.child(context);
    childLogger.context = { ...this.context, ...context };
    return childLogger;
  }

  /**
   * Trace level log (most verbose)
   */
  trace(message: string, data?: Record<string, unknown>): void {
    this.pinoLogger.trace({ ...this.context, ...data }, message);
  }

  /**
   * Debug level log
   */
  debug(message: string, data?: Record<string, unknown>): void {
    this.pinoLogger.debug({ ...this.context, ...data }, message);
  }

  /**
   * Info level log
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.pinoLogger.info({ ...this.context, ...data }, message);
  }

  /**
   * Warning level log
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.pinoLogger.warn({ ...this.context, ...data }, message);
  }

  /**
   * Error level log
   */
  error(
    message: string,
    error?: Error | unknown,
    data?: Record<string, unknown>
  ): void {
    const errorData =
      error instanceof Error
        ? {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          }
        : { error };

    this.pinoLogger.error({ ...this.context, ...errorData, ...data }, message);
  }

  /**
   * Fatal level log (most severe)
   */
  fatal(
    message: string,
    error?: Error | unknown,
    data?: Record<string, unknown>
  ): void {
    const errorData =
      error instanceof Error
        ? {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          }
        : { error };

    this.pinoLogger.fatal({ ...this.context, ...errorData, ...data }, message);
  }

  /**
   * Time a function execution
   */
  async time<T>(label: string, fn: () => Promise<T> | T): Promise<T> {
    const start = Date.now();
    this.debug(`[${label}] Started`);

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.info(`[${label}] Completed`, { duration });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.error(`[${label}] Failed`, error, { duration });
      throw error;
    }
  }

  // Helper methods

  private isDevelopment(): boolean {
    if (this.isBrowser()) {
      return window.location.hostname === 'localhost';
    }
    return process.env['NODE_ENV'] === 'development';
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getDefaultLevel(): LogLevel {
    if (this.isBrowser()) {
      return this.isDevelopment() ? 'debug' : 'info';
    }

    const envLevel = process.env['LOG_LEVEL'] as LogLevel;
    if (envLevel) {
      return envLevel;
    }

    return this.isDevelopment() ? 'debug' : 'info';
  }
}

// Export singleton instance
export const logger = new Logger();

// Export Logger class for custom instances
export { Logger };

// Export type for context
export type { LogContext as LogContextType };
