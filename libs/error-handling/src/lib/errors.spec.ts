import { describe, it, expect } from 'vitest';

import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  ErrorCode,
  isOperationalError,
  getStatusCode,
  getErrorCode,
} from './errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with code and message', () => {
      const error = new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Something went wrong',
        500
      );

      expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(error.message).toBe('Something went wrong');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('should include context', () => {
      const context = { userId: '123', action: 'create' };
      const error = new AppError(
        ErrorCode.VALIDATION_FAILED,
        'Invalid input',
        400,
        true,
        context
      );

      expect(error.context).toEqual(context);
    });

    it('should serialize to JSON', () => {
      const error = new AppError(
        ErrorCode.NOT_FOUND,
        'User not found',
        404
      );

      const json = error.toJSON();
      expect(json.code).toBe(ErrorCode.NOT_FOUND);
      expect(json.message).toBe('User not found');
      expect(json.statusCode).toBe(404);
    });
  });

  describe('AuthenticationError', () => {
    it('should create auth error with 401 status', () => {
      const error = new AuthenticationError();
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    });

    it('should accept custom message', () => {
      const error = new AuthenticationError('Invalid token');
      expect(error.message).toBe('Invalid token');
    });
  });

  describe('AuthorizationError', () => {
    it('should create authorization error with 403 status', () => {
      const error = new AuthorizationError();
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe(ErrorCode.FORBIDDEN);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with 400 status', () => {
      const error = new ValidationError();
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ErrorCode.VALIDATION_FAILED);
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error with 404 status', () => {
      const error = new NotFoundError('User');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.message).toBe('User not found');
    });
  });

  describe('ConflictError', () => {
    it('should create conflict error with 409 status', () => {
      const error = new ConflictError();
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe(ErrorCode.ALREADY_EXISTS);
    });
  });

  describe('Helper functions', () => {
    it('should check if error is operational', () => {
      const operationalError = new ValidationError();
      const programmerError = new Error('Programmer error');

      expect(isOperationalError(operationalError)).toBe(true);
      expect(isOperationalError(programmerError)).toBe(false);
    });

    it('should get status code from error', () => {
      const error = new NotFoundError('User');
      expect(getStatusCode(error)).toBe(404);

      const genericError = new Error('Generic');
      expect(getStatusCode(genericError)).toBe(500);
    });

    it('should get error code from error', () => {
      const error = new ValidationError();
      expect(getErrorCode(error)).toBe(ErrorCode.VALIDATION_FAILED);

      const genericError = new Error('Generic');
      expect(getErrorCode(genericError)).toBe(ErrorCode.INTERNAL_ERROR);
    });
  });
});

