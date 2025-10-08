import { AxiosRequestConfig, AxiosResponse } from 'axios';
import apiClient from '../api/apiClient';
import { handleRedirect } from './handleRedirect';
import { toast } from 'sonner';
import ApiCodes from '../api/apiCodes.json';
import type { ApiData } from '../types';

/**
 * POST 請求（提交表單）
 */
export async function postOryForm<T = any>(
  url: string,
  data: Record<string, string>,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return await apiClient.post(url, data, config);
}

/**
 * GET 請求（取得 flow）
 */
export async function getOryFlow<T = ApiData.FlowData>(
  flowType: 'login' | 'registration' | 'settings' | 'recovery' | 'verification',
  flowId: string
): Promise<T> {
  const res = await apiClient.get<T>(`/self-service/${flowType}/flows`, {
    params: { id: flowId },
  });
  return res.data;
}

/**
 * 錯誤處理：toast、跳轉、錯誤碼翻譯
 */
export function handleOryError(error: any, flowId?: string) {
  const status = error?.response?.status;

  if (status === 400) {
    const messages = error?.response?.data?.ui?.messages;
    const text = messages?.[0]?.text || '請求錯誤';
    toast.error(text, { duration: Infinity, closeButton: true });
  }

  if (status === 422) {
    const redirectUrl = error?.response?.data?.redirect_browser_to;
    if (redirectUrl) {
      handleRedirect(redirectUrl);
    }
  }

  if (status === 303) {
    const location = error?.response?.headers?.['location'];
    if (location) handleRedirect(location);
  }

  // ErrorCodes (ex: 密碼已使用)
  const flowNodes = error?.response?.data?.ui?.nodes;
  const passwordErrorNode = flowNodes?.find(
    (el: any) => el.group === 'password' && el.messages?.[0]?.type === 'error'
  );

  if (passwordErrorNode) {
    const msg = passwordErrorNode.messages[0];
    const tip =
      ApiCodes?.ErrorCodes?.[msg.id as keyof typeof ApiCodes.ErrorCodes]?.tips;
    const finalMsg = tip ? `${tip}\n${msg.text}` : msg.text;
    toast.error(finalMsg, { duration: Infinity, closeButton: true });
  }

  // fallback error
  if (!status || status >= 500) {
    toast.error('伺服器發生錯誤，請稍後再試', {
      duration: Infinity,
      closeButton: true,
    });
  }

  // flowId fallback error redirect
  if (flowId && ![400, 422, 303].includes(status)) {
    handleRedirect(`/error?id=${flowId}`);
  }
}

/**
 * GET 請求（檢查 username 是否已被使用）
 */
export async function getIdentifier(
  username: string,
  token?: string
): Promise<ApiData.IdentityRes> {
  const res = await apiClient.get<ApiData.IdentityRes>(
    `/identities/${username}`,
    {
      headers: { 'CF-TURNSTILE-RESPONSE': token },
    }
  );
  return res.data;
}
