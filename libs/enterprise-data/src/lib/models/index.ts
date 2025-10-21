// Enterprise data models
// Add your data models here

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Approval {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  approvedBy?: string;
}
