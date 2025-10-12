import { formatISO } from 'date-fns';

import { type SessionBlockType } from '../types';

export function calculateOffsetSaleTime({
  sessionBlock,
  item,
  type, // 'start' | 'end'
  offset,
  offsetBase,
}: {
  sessionBlock: SessionBlockType[];
  item: { sessionId: string; startTime: string; endTime: string };
  type: 'start' | 'end';
  offset: number;
  offsetBase: number;
}) {
  const matchSession = sessionBlock.find(s => s.id === item.sessionId);
  if (!matchSession) return item;

  const sessionTime =
    type === 'start' ? matchSession.startTime : matchSession.endTime;
  const sessionISO = `${matchSession.date}T${sessionTime}`;
  const sessionDate = new Date(sessionISO);

  const newDate = new Date(sessionDate);
  newDate.setMinutes(newDate.getMinutes() - offset * offsetBase);
  const newDateWithOffset = formatISO(newDate, { representation: 'complete' });
  return {
    ...item,
    [`${type}Time`]: newDateWithOffset,
  };
}
