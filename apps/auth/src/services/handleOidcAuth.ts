import { postOryForm, handleOryError } from './orySdk';
import { handleRedirect } from './handleRedirect';
import { ApiData } from '../types';
interface Props {
  provider: 'line' | 'google' | 'apple';
  flowId: string;
  type: 'registration' | 'login';
  token: string;
}
export type OryResponse = ApiData.SessionRes | ApiData.FlowRes;
async function handleOidcAuth(props: Props) {
  const { provider, flowId, type, token } = props;

  try {
    const res = await postOryForm<OryResponse>(
      `/self-service/${type}`,
      {
        csrf_token: token,
        provider,
      },
      {
        params: { flow: flowId },
      }
    );

    const data = res.data as OryResponse;
    let redirectUrl: string | undefined;

    if ('continue_with' in data) {
      const sessionData = data as ApiData.SessionRes;
      redirectUrl = sessionData.data.continue_with?.[0]?.redirect_browser_to;
    } else if ('ui' in data) {
      const flowData = data as ApiData.FlowRes;
      redirectUrl = flowData.data.ui?.messages?.find(
        m => m.type === 'success'
      )?.text;
    }

    if (redirectUrl) {
      handleRedirect(redirectUrl);
    }
  } catch (err: any) {
    const redirectUrl =
      err?.response?.data?.redirect_browser_to ||
      err?.response?.headers?.location;

    if (redirectUrl) {
      handleRedirect(redirectUrl);
      return;
    }

    handleOryError(err);
  }
}

export default handleOidcAuth;
