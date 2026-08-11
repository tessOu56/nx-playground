/**
 * Mock data shaped to match the portal access-request contract
 * (see planning/projects/nx-playground.md, contracts-ci libs/contracts).
 * Mobile M0 does not own decisioning policy — it only renders/mutates
 * this mock shape locally, matching portal's pending_approval/approved/denied
 * status vocabulary, decision_id, and auditLogged flag.
 */

export type ApprovalStatus = 'pending_approval' | 'approved' | 'denied';

export interface AccessRequestApproval {
  decision_id: string;
  requester: string;
  resource: string;
  reason: string;
  status: ApprovalStatus;
  auditLogged: boolean;
  requestedAt: string;
}

export const initialApprovals: AccessRequestApproval[] = [
  {
    decision_id: 'dec-2026-0001',
    requester: 'jane.doe@example.com',
    resource: 'catalog-az-search-api:/admin',
    reason: 'Incident response — read-only diagnostics',
    status: 'pending_approval',
    auditLogged: false,
    requestedAt: '2026-08-10T09:12:00Z',
  },
  {
    decision_id: 'dec-2026-0002',
    requester: 'sam.lee@example.com',
    resource: 'ai-search-portal:/reports',
    reason: 'Quarterly export access',
    status: 'pending_approval',
    auditLogged: false,
    requestedAt: '2026-08-10T14:45:00Z',
  },
  {
    decision_id: 'dec-2026-0003',
    requester: 'kim.park@example.com',
    resource: 'nx-playground:/enterprise-admin',
    reason: 'Onboarding — new admin seat',
    status: 'pending_approval',
    auditLogged: false,
    requestedAt: '2026-08-11T02:05:00Z',
  },
];
