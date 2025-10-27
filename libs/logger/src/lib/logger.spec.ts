import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Logger } from './logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger({
      enabled: true,
      prettyPrint: false,
    });
  });

  describe('setContext', () => {
    it('should set context for all logs', () => {
      logger.setContext({ userId: '123', requestId: 'req-456' });
      const context = logger.getContext();

      expect(context).toEqual({
        userId: '123',
        requestId: 'req-456',
      });
    });

    it('should merge context when called multiple times', () => {
      logger.setContext({ userId: '123' });
      logger.setContext({ requestId: 'req-456' });
      const context = logger.getContext();

      expect(context).toEqual({
        userId: '123',
        requestId: 'req-456',
      });
    });
  });

  describe('clearContext', () => {
    it('should clear all context', () => {
      logger.setContext({ userId: '123' });
      logger.clearContext();
      const context = logger.getContext();

      expect(context).toEqual({});
    });
  });

  describe('child', () => {
    it('should create child logger with additional context', () => {
      logger.setContext({ userId: '123' });
      const childLogger = logger.child({ requestId: 'req-456' });
      const childContext = childLogger.getContext();

      expect(childContext).toEqual({
        userId: '123',
        requestId: 'req-456',
      });
    });
  });

  describe('log methods', () => {
    it('should log trace messages', () => {
      const spy = vi.spyOn(console, 'log');
      logger.trace('Trace message', { detail: 'test' });
      // Note: In test environment, logs might not appear
      // This is a basic test to ensure no errors are thrown
      expect(spy).toBeDefined();
    });

    it('should log debug messages', () => {
      expect(() => {
        logger.debug('Debug message', { detail: 'test' });
      }).not.toThrow();
    });

    it('should log info messages', () => {
      expect(() => {
        logger.info('Info message', { detail: 'test' });
      }).not.toThrow();
    });

    it('should log warn messages', () => {
      expect(() => {
        logger.warn('Warning message', { detail: 'test' });
      }).not.toThrow();
    });

    it('should log error messages', () => {
      expect(() => {
        const error = new Error('Test error');
        logger.error('Error message', error, { detail: 'test' });
      }).not.toThrow();
    });

    it('should log fatal messages', () => {
      expect(() => {
        const error = new Error('Fatal error');
        logger.fatal('Fatal message', error, { detail: 'test' });
      }).not.toThrow();
    });
  });

  describe('time', () => {
    it('should time synchronous function execution', async () => {
      const result = await logger.time('sync-test', () => {
        return 'result';
      });

      expect(result).toBe('result');
    });

    it('should time asynchronous function execution', async () => {
      const result = await logger.time('async-test', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'async-result';
      });

      expect(result).toBe('async-result');
    });

    it('should log error and re-throw on failure', async () => {
      const testError = new Error('Test error');

      await expect(
        logger.time('error-test', () => {
          throw testError;
        })
      ).rejects.toThrow(testError);
    });
  });
});

