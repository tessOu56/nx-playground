import { useCallback, useState } from 'react';
import { AccessRequestApproval, ApprovalStatus, initialApprovals } from '../data/mockApprovals';

export type Decision = 'approved' | 'denied';

/**
 * Pure transition function kept separate from the hook so it can be unit
 * tested (smoke test) without pulling in React Native's test renderer.
 */
export function applyDecision(
  approvals: AccessRequestApproval[],
  decisionId: string,
  decision: Decision
): AccessRequestApproval[] {
  return approvals.map((approval) =>
    approval.decision_id === decisionId
      ? { ...approval, status: decision as ApprovalStatus, auditLogged: true }
      : approval
  );
}

export function useApprovals() {
  const [approvals, setApprovals] = useState<AccessRequestApproval[]>(initialApprovals);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const select = useCallback((decisionId: string) => setSelectedId(decisionId), []);
  const clearSelection = useCallback(() => setSelectedId(null), []);

  const decide = useCallback((decisionId: string, decision: Decision) => {
    setApprovals((prev) => applyDecision(prev, decisionId, decision));
  }, []);

  const selected = approvals.find((a) => a.decision_id === selectedId) ?? null;
  const pending = approvals.filter((a) => a.status === 'pending_approval');

  return { approvals, pending, selected, select, clearSelection, decide };
}
