/**
 * Project mock data generators
 */

export interface MockProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  status: 'development' | 'production' | 'archived';
  type: 'app' | 'lib';
}

export function createMockProject(
  overrides: Partial<MockProject> = {}
): MockProject {
  return {
    id: 'project-1',
    name: 'Test Project',
    description: 'This is a test project',
    techStack: ['React', 'TypeScript', 'Vite'],
    status: 'production',
    type: 'app',
    ...overrides,
  };
}

export function createMockProjects(count: number): MockProject[] {
  return Array.from({ length: count }, (_, i) =>
    createMockProject({
      id: `project-${i + 1}`,
      name: `Project ${i + 1}`,
    })
  );
}

