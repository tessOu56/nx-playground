import { describe, it, expect } from 'vitest';
import { createMockUser, createMockUsers } from '../mocks/user';
import { createMockEvent } from '../mocks/event';
import { createMockBlog } from '../mocks/blog';
import { createMockProject } from '../mocks/project';
import { randomId, wait } from '../utils/test-utils';

describe('test-utils', () => {
  describe('Mock Generators', () => {
    it('should create mock user with defaults', () => {
      const user = createMockUser();
      expect(user).toMatchObject({
        id: 'user-123',
        email: 'test@example.com',
        role: 'user',
      });
    });

    it('should create mock user with overrides', () => {
      const user = createMockUser({ role: 'admin', name: 'Admin User' });
      expect(user.role).toBe('admin');
      expect(user.name).toBe('Admin User');
    });

    it('should create multiple mock users', () => {
      const users = createMockUsers(5);
      expect(users).toHaveLength(5);
      expect(users[0].email).toBe('user1@example.com');
    });

    it('should create mock event', () => {
      const event = createMockEvent();
      expect(event.status).toBe('published');
      expect(event.capacity).toBe(100);
    });

    it('should create mock blog', () => {
      const blog = createMockBlog();
      expect(blog.slug).toBe('2024-12');
      expect(blog.techStack).toContain('React');
    });

    it('should create mock project', () => {
      const project = createMockProject();
      expect(project.type).toBe('app');
      expect(project.status).toBe('production');
    });
  });

  describe('Test Utilities', () => {
    it('should generate random ID', () => {
      const id1 = randomId('test');
      const id2 = randomId('test');
      expect(id1).toMatch(/^test-/);
      expect(id1).not.toBe(id2);
    });

    it('should wait for specified time', async () => {
      const start = Date.now();
      await wait(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90);
    });
  });
});
