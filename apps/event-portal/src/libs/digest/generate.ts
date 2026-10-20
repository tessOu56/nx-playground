import { classifyWeeklyDigest } from './classify';
import { renderDigestMessages } from './format';
import type { DigestExhibition, DigestMessage, WeeklyDigest } from './types';

export type GeneratedWeeklyDigest = {
  digest: WeeklyDigest;
  messages: DigestMessage[];
};

/** Pure weekly digest: classify per city, then render zh / ja / en. */
export function generateWeeklyDigest(
  exhibitions: readonly DigestExhibition[],
  now: Date,
  origin: string
): GeneratedWeeklyDigest {
  const digest = classifyWeeklyDigest(exhibitions, now);
  return {
    digest,
    messages: renderDigestMessages(digest, origin),
  };
}
