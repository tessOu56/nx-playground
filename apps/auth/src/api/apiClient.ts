import axios, { AxiosHeaders } from 'axios';
import { toast } from 'sonner';
import { handleDomain } from '../services/handleDomain';
import { handleRedirect } from '../services/handleRedirect';

const apiClient = axios.create({
  baseURL: handleDomain(),
  timeout: 5000,
});

apiClient.interceptors.request.use(
  config => {
    if (!config.headers) {
      config.headers = AxiosHeaders.from({});
    }
    config.withCredentials = true;

    // --- ⬇️ 自動補上 Content-Type ---
    if (config.data && !config.headers['Content-Type']) {
      const isFormData = config.data instanceof FormData;
      const isUrlEncoded = config.data instanceof URLSearchParams;

      if (isFormData) {
        // multipart/form-data → axios 自動處理 boundary，這裡不加
      } else if (isUrlEncoded) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        // 預設以 JSON 傳遞
        config.headers['Content-Type'] = 'application/json';
      }
    }
    // --------------------------------

    return config;
  },
  error => {
    const params = error.config?.params
      ? new URLSearchParams(error.config.params).toString()
      : '';
    toast.error(
      `API 呼叫請求錯誤：\n 路徑：${error.config?.url}?${params}\n 訊息：${error.message}`,
      { duration: Infinity, closeButton: true }
    );
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    return response; // AxiosResponse
  },
  error => {
    if (window.location.pathname === '/error') {
      return Promise.reject(error);
    }
    const params = error.config?.params
      ? new URLSearchParams(error.config.params).toString()
      : '';
    const redirectUrl = error.response.headers['Location'];
    switch (error.response?.status) {
      case 302: // Found
        if (redirectUrl) {
          handleRedirect(redirectUrl);
        } else {
          toast.error('Redirect URL is missing in headers', {
            duration: Infinity,
            closeButton: true,
          });
        }
        return Promise.reject(error);
      case 303: // See Other
        if (!redirectUrl) {
          toast.error('Redirect URL is missing in headers', {
            duration: Infinity,
            closeButton: true,
          });
        }
        return Promise.reject(error);
      case 400: // Bad Request
        return Promise.reject(error);
      case 401: // Unauthorized
        toast.error(
          `API 呼叫回應錯誤：\n 路徑：${error.config?.url}?${params}\n 訊息：未授權`,
          { duration: Infinity, closeButton: true }
        );
        return Promise.reject(error);
      case 403: // Forbidden
        toast.error(
          `API 呼叫回應錯誤：\n 路徑：${error.config?.url}?${params}\n 訊息：停留時間過長，超過 token 期效`,
          { duration: Infinity, closeButton: true }
        );
        return Promise.reject(error);
      case 404: // Not Found，多為 token 或是 flowID 沒帶導致未通過 api gateway 授權
        toast.error(
          `API 呼叫回應錯誤：\n 路徑：${error.config?.url}?${params}\n 訊息：${
            error.response?.data?.message || error.message
          }`,
          { duration: Infinity, closeButton: true }
        );
        return Promise.reject(error);
      case 410: // token 過期
        toast.error(
          `API 呼叫回應錯誤：\n 路徑：${error.config?.url}?${params}\n 訊息：token 過期`,
          { duration: Infinity, closeButton: true }
        );
        return Promise.reject(error);
      case 422: // Unprocessable Entity
        if (!error?.response?.data?.redirect_browser_to) {
          toast.error(
            `API 呼叫回應錯誤：\n 路徑：${error.config?.url}?${params}\n 訊息：沒有第三方登入轉址`,
            { duration: Infinity, closeButton: true }
          );
        }
        return Promise.reject(error);
      case 500: // Internal Server Error
        toast.error(
          `API 呼叫回應錯誤：\n 路徑：${error.config?.url}?${params}\n 訊息：${
            error.response?.data?.message || error.message
          }`,
          { duration: Infinity, closeButton: true }
        );
        return Promise.reject(error);
      default:
        // const queryParams = new URLSearchParams({
        //   id:  error.config?.params?.id || error.config?.params?.flow
        // }).toString();
        return Promise.reject(error);
    }
  }
);

export default apiClient;
