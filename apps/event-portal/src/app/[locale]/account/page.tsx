'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Suspense, useCallback, useEffect, useState } from 'react';

import {
  identityAuthErrorText,
  resolveAuthError,
} from '@/libs/auth/auth-errors';
import { authClient } from '@/libs/auth/auth-client';
import { LINE_TW_PROVIDER_ID } from '@/libs/auth/line-account-map';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { canStartLineLogin } from '@/libs/line/constants';

type LinkedAccount = {
  id: string;
  providerId: string;
  accountId?: string;
};

type PasskeyRow = {
  id: string;
  name?: string | null;
  createdAt?: Date | string | null;
};

function authErrorCopy(copy: ReturnType<typeof demoCopy>) {
  return {
    alreadyLinkedToOtherUser: copy.alreadyLinkedToOtherUser,
    lastSignInMethod: copy.lastSignInMethod,
    accountNotLinked: copy.accountNotLinked,
    sessionNotFresh: copy.sessionNotFresh,
    fallback: copy.lineLoginError,
  };
}

function AccountSettings() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const copy = demoCopy(locale);
  const lineReady = canStartLineLogin();
  const loginHref = `/${locale}/login?return_to=${encodeURIComponent(
    `/${locale}/account`
  )}`;

  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [passkeys, setPasskeys] = useState<PasskeyRow[]>([]);
  const [error, setError] = useState<string | null>(
    identityAuthErrorText(authErrorCopy(copy), {
      error: searchParams.get('error'),
      code: searchParams.get('error_code') ?? searchParams.get('code'),
      message:
        searchParams.get('error_description') ?? searchParams.get('message'),
    })
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const load = useCallback(async () => {
    const messages = demoCopy(locale);
    const session = await authClient.getSession();
    if (!session.data?.user) {
      setSignedIn(false);
      setReady(true);
      return;
    }
    const [accountResult, passkeyResult] = await Promise.all([
      authClient.listAccounts(),
      authClient.passkey.listUserPasskeys(),
    ]);
    setSignedIn(true);
    setAccounts(
      (accountResult.data ?? []).flatMap(account =>
        account.id && account.providerId
          ? [
              {
                id: account.id,
                providerId: account.providerId,
                accountId: account.accountId,
              },
            ]
          : []
      )
    );
    setPasskeys(
      (passkeyResult.data ?? []).flatMap(passkey =>
        passkey.id
          ? [
              {
                id: passkey.id,
                name: passkey.name,
                createdAt: passkey.createdAt,
              },
            ]
          : []
      )
    );
    if (accountResult.error) {
      setError(resolveAuthError(authErrorCopy(messages), accountResult.error));
    } else if (passkeyResult.error) {
      setError(resolveAuthError(authErrorCopy(messages), passkeyResult.error));
    }
    setReady(true);
  }, [locale]);

  useEffect(() => {
    void load();
  }, [load]);

  const methodCount = accounts.length + passkeys.length;
  const lastMethod = methodCount <= 1;
  const hasProvider = (providerId: string) =>
    accounts.some(account => account.providerId === providerId);

  const run = async (key: string, action: () => Promise<void>) => {
    setBusy(key);
    setError(null);
    try {
      await action();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.lineLoginError);
    } finally {
      setBusy(null);
    }
  };

  const linkProvider = async (
    provider: 'google' | typeof LINE_TW_PROVIDER_ID
  ) => {
    const callbackURL =
      typeof window === 'undefined'
        ? `/${locale}/account`
        : `${window.location.origin}/${locale}/account`;
    await run(`link:${provider}`, async () => {
      const result = await authClient.linkSocial({
        provider,
        callbackURL,
        errorCallbackURL: callbackURL,
      });
      if (result.error) {
        setError(resolveAuthError(authErrorCopy(copy), result.error));
      }
    });
  };

  const unlinkProvider = async (providerId: string) => {
    const account = accounts.find(item => item.providerId === providerId);
    if (!account?.id) {
      setError(copy.lineLoginError);
      return;
    }
    await run(`unlink:${providerId}`, async () => {
      const result = await authClient.unlinkAccount({
        accountId: account.id,
      });
      if (result.error) {
        setError(resolveAuthError(authErrorCopy(copy), result.error));
        return;
      }
      await load();
    });
  };

  const addPasskey = async () => {
    await run('add-passkey', async () => {
      const result = await authClient.passkey.addPasskey({
        name: copy.unnamedPasskey,
      });
      if (result.error) {
        setError(resolveAuthError(authErrorCopy(copy), result.error));
        return;
      }
      await load();
    });
  };

  const savePasskeyName = async (id: string) => {
    const name = renameValue.trim();
    if (!name) return;
    await run(`rename:${id}`, async () => {
      const result = await authClient.passkey.updatePasskey({ id, name });
      if (result.error) {
        setError(resolveAuthError(authErrorCopy(copy), result.error));
        return;
      }
      setRenameId(null);
      await load();
    });
  };

  const deletePasskey = async (id: string) => {
    await run(`delete:${id}`, async () => {
      const result = await authClient.passkey.deletePasskey({ id });
      if (result.error) {
        setError(resolveAuthError(authErrorCopy(copy), result.error));
        return;
      }
      await load();
    });
  };

  if (!ready) {
    return (
      <div className='mx-auto max-w-md px-4 py-16 text-sm text-muted-foreground'>
        {copy.loadingLabel}
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className='mx-auto max-w-md px-4 py-16'>
        <h1 className='font-display text-2xl font-semibold text-foreground'>
          {copy.accountTitle}
        </h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          {copy.signInRequired}
        </p>
        <Link
          href={loginHref}
          className='mt-6 inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted'
        >
          {copy.signIn}
        </Link>
      </div>
    );
  }

  const providers: Array<{
    id: 'google' | typeof LINE_TW_PROVIDER_ID;
    label: string;
    show: boolean;
  }> = [
    {
      id: LINE_TW_PROVIDER_ID,
      label: 'LINE',
      show: lineReady || hasProvider(LINE_TW_PROVIDER_ID),
    },
    { id: 'google', label: 'Google', show: true },
  ];

  return (
    <div className='mx-auto max-w-md px-4 py-16'>
      <h1 className='font-display text-2xl font-semibold text-foreground'>
        {copy.accountTitle}
      </h1>
      <p className='mt-2 text-sm text-muted-foreground'>{copy.accountLead}</p>

      <section className='mt-8' aria-labelledby='linked-accounts-heading'>
        <h2
          id='linked-accounts-heading'
          className='text-sm font-semibold text-foreground'
        >
          {copy.linkedAccounts}
        </h2>
        <ul className='mt-3 flex flex-col gap-3'>
          {providers
            .filter(provider => provider.show)
            .map(provider => {
              const linked = hasProvider(provider.id);
              const unlinkBlocked = linked && lastMethod;
              return (
                <li
                  key={provider.id}
                  className='flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5'
                >
                  <div>
                    <p className='text-sm font-medium text-foreground'>
                      {provider.label}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {linked ? copy.linked : copy.notLinked}
                    </p>
                  </div>
                  {linked ? (
                    <button
                      type='button'
                      disabled={unlinkBlocked || busy !== null}
                      title={unlinkBlocked ? copy.lastMethodHint : undefined}
                      onClick={() => void unlinkProvider(provider.id)}
                      className='rounded-md px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {copy.unlinkAccount}
                    </button>
                  ) : (
                    <button
                      type='button'
                      disabled={busy !== null}
                      onClick={() => void linkProvider(provider.id)}
                      className='rounded-md px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted disabled:opacity-50'
                    >
                      {copy.linkAccount}
                    </button>
                  )}
                </li>
              );
            })}
        </ul>
      </section>

      <section className='mt-10' aria-labelledby='passkeys-heading'>
        <div className='flex items-center justify-between gap-3'>
          <h2
            id='passkeys-heading'
            className='text-sm font-semibold text-foreground'
          >
            {copy.passkeysTitle}
          </h2>
          <button
            type='button'
            disabled={busy !== null}
            onClick={() => void addPasskey()}
            className='rounded-md px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted disabled:opacity-50'
          >
            {copy.addPasskey}
          </button>
        </div>
        {passkeys.length === 0 ? (
          <p className='mt-3 text-sm text-muted-foreground'>
            {copy.noPasskeys}
          </p>
        ) : (
          <ul className='mt-3 flex flex-col gap-3'>
            {passkeys.map(passkey => {
              const deleteBlocked = lastMethod;
              const renaming = renameId === passkey.id;
              return (
                <li
                  key={passkey.id}
                  className='rounded-md border border-border px-3 py-2.5'
                >
                  {renaming ? (
                    <form
                      className='flex flex-col gap-2'
                      onSubmit={event => {
                        event.preventDefault();
                        void savePasskeyName(passkey.id);
                      }}
                    >
                      <label
                        className='sr-only'
                        htmlFor={`passkey-name-${passkey.id}`}
                      >
                        {copy.passkeyName}
                      </label>
                      <input
                        id={`passkey-name-${passkey.id}`}
                        value={renameValue}
                        onChange={event => setRenameValue(event.target.value)}
                        className='rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
                      />
                      <button
                        type='submit'
                        disabled={busy !== null || !renameValue.trim()}
                        className='self-start rounded-md px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted disabled:opacity-50'
                      >
                        {copy.savePasskeyName}
                      </button>
                    </form>
                  ) : (
                    <div className='flex items-center justify-between gap-3'>
                      <p className='text-sm font-medium text-foreground'>
                        {passkey.name?.trim() || copy.unnamedPasskey}
                      </p>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          disabled={busy !== null}
                          onClick={() => {
                            setRenameId(passkey.id);
                            setRenameValue(passkey.name?.trim() ?? '');
                          }}
                          className='rounded-md px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted disabled:opacity-50'
                        >
                          {copy.renamePasskey}
                        </button>
                        <button
                          type='button'
                          disabled={deleteBlocked || busy !== null}
                          title={
                            deleteBlocked ? copy.lastMethodHint : undefined
                          }
                          onClick={() => void deletePasskey(passkey.id)}
                          className='rounded-md px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          {copy.deletePasskey}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {error ? (
        <p className='mt-6 text-sm text-red-800' role='alert'>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountSettings />
    </Suspense>
  );
}
