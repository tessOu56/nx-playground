import { applyDecision } from './useApprovals';
import { initialApprovals } from '../data/mockApprovals';

describe('applyDecision (mobile-approvals M0 smoke test)', () => {
  it('approves the targeted request and sets auditLogged, matching portal contract shape', () => {
    const target = initialApprovals[0];
    const result = applyDecision(initialApprovals, target.decision_id, 'approved');
    const updated = result.find((a) => a.decision_id === target.decision_id);

    expect(updated).toBeDefined();
    expect(updated?.status).toBe('approved');
    expect(updated?.auditLogged).toBe(true);
    expect(updated?.decision_id).toBe(target.decision_id);
  });

  it('denies the targeted request without mutating other pending requests', () => {
    const target = initialApprovals[1];
    const result = applyDecision(initialApprovals, target.decision_id, 'denied');
    const untouched = result.find((a) => a.decision_id !== target.decision_id);

    expect(result.find((a) => a.decision_id === target.decision_id)?.status).toBe('denied');
    expect(untouched?.status).toBe('pending_approval');
    expect(untouched?.auditLogged).toBe(false);
  });
});
