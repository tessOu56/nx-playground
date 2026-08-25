import { MOCK_DATA_APPLICATIONS } from './applications';
import type { DataApplication } from '../types';

let applications: DataApplication[] = MOCK_DATA_APPLICATIONS.map(row => ({
  ...row,
}));

export class MockDataApplications {
  static list(): DataApplication[] {
    return applications.map(row => ({ ...row }));
  }

  static reset(): void {
    applications = MOCK_DATA_APPLICATIONS.map(row => ({ ...row }));
  }
}
