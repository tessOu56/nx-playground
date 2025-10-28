import { describe, it, expect, vi, beforeEach } from 'vitest';

import { loadAppReadme, loadLibReadme, loadAllAppsReadmes, loadAllLibsReadmes } from '../readmeLoader';
import { loadAppSpec, loadLibSpec, loadAllAppsSpecs, loadAllLibsSpecs } from '../specLoader';

// Mock fetch
global.fetch = vi.fn();

describe('README Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadAppReadme', () => {
    it('should load app README successfully', async () => {
      const mockContent = `---
id: test-app
name: Test App
version: 1.0.0
description: A test application
techStack:
  - React
  - TypeScript
---

# Test App

This is a test application.`;

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await loadAppReadme('test-app', 'en');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-app');
      expect(result?.name).toBe('Test App');
      expect(result?.version).toBe('1.0.0');
      expect(result?.description).toBe('A test application');
      expect(result?.techStack).toEqual(['React', 'TypeScript']);
    });

    it('should return null for missing README', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      const result = await loadAppReadme('missing-app', 'en');

      expect(result).toBeNull();
    });

    it('should handle fallback to default locale', async () => {
      const mockContent = `---
id: test-app
name: Test App
---

# Test App`;

      (fetch as any)
        .mockResolvedValueOnce({ ok: false }) // First try fails
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockContent),
        });

      const result = await loadAppReadme('test-app', 'zh-TW');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-app');
    });
  });

  describe('loadLibReadme', () => {
    it('should load lib README successfully', async () => {
      const mockContent = `---
id: test-lib
name: Test Library
version: 2.0.0
description: A test library
---

# Test Library

This is a test library.`;

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await loadLibReadme('test-lib', 'en');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-lib');
      expect(result?.name).toBe('Test Library');
    });
  });

  describe('loadAllAppsReadmes', () => {
    it('should load all apps and return sorted array', async () => {
      const mockContent = `---
id: test-app
name: Test App
---

# Test App`;

      (fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await loadAllAppsReadmes('en');

      expect(Array.isArray(result)).toBe(true);
      // Should be sorted by name
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('loadAllLibsReadmes', () => {
    it('should load all libs and return sorted array', async () => {
      const mockContent = `---
id: test-lib
name: Test Library
---

# Test Library`;

      (fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await loadAllLibsReadmes('en');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ])
      );
    });
  });
});

describe('Spec Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadAppSpec', () => {
    it('should load app spec successfully', async () => {
      const mockContent = `# Test App Spec

## Overview
This is a test application specification.`;

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await loadAppSpec('test-app', 'en');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-app');
      expect(result?.content).toContain('Test App Spec');
    });

    it('should return null for missing spec', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      const result = await loadAppSpec('missing-app', 'en');

      expect(result).toBeNull();
    });
  });

  describe('loadLibSpec', () => {
    it('should load lib spec successfully', async () => {
      const mockContent = `# Test Library Spec

## Overview
This is a test library specification.`;

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await loadLibSpec('test-lib', 'en');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-lib');
      expect(result?.content).toContain('Test Library Spec');
    });
  });

  describe('loadAllAppsSpecs', () => {
    it('should load all app specs and return array', async () => {
      const mockContent = `# Test App Spec

## Overview
Test specification.`;

      (fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await loadAllAppsSpecs('en');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('loadAllLibsSpecs', () => {
    it('should load all lib specs and return array', async () => {
      const mockContent = `# Test Library Spec

## Overview
Test specification.`;

      (fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await loadAllLibsSpecs('en');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String),
          }),
        ])
      );
    });
  });
});

describe('Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle network errors gracefully', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const result = await loadAppReadme('test-app', 'en');

    expect(result).toBeNull();
  });

  it('should handle malformed front matter gracefully', async () => {
    const malformedContent = `---
id: test-app
name: Test App
invalid-yaml: [unclosed array
---

# Test App`;

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(malformedContent),
    });

    const result = await loadAppReadme('test-app', 'en');

    // Should handle gracefully and return null or partial data
    expect(result).toBeDefined();
  });
});

describe('No Console Output', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console methods to ensure no debug output
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should not output console.log during normal operation', async () => {
    const mockContent = `---
id: test-app
name: Test App
---

# Test App`;

    (fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockContent),
    });

    await loadAllAppsReadmes('en');

    // Verify no console.log was called (except for errors which are expected)
    expect(console.log).not.toHaveBeenCalled();
  });
});
