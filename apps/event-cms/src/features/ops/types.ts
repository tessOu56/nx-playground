export type DataApplicationStatus = 'pending' | 'approved' | 'rejected';

export type DataApplication = {
  id: string;
  requester: string;
  purpose: string;
  asset: string;
  status: DataApplicationStatus;
  submittedAt: string;
  labelledMock: true;
};
