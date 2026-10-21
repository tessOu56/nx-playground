export type PasskeyRelyingParty = {
  rpID: string;
  origin: string;
};

export function passkeyRelyingParty(baseURL: string): PasskeyRelyingParty {
  const url = new URL(baseURL);
  return {
    rpID: url.hostname,
    origin: url.origin,
  };
}
