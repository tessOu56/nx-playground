// 測試 Registration Flow API 的使用
import { useCreateBrowserRegistrationFlow } from './generated/identity/dev/saaSAPI';

// 這是一個自定義 Hook，展示如何使用生成的 API
export const useTestRegistrationFlow = () => {
  // 使用生成的 hook 來獲取註冊流程
  const {
    data: registrationFlow,
    isLoading,
    error,
  } = useCreateBrowserRegistrationFlow();

  if (isLoading) {
    console.log('Loading registration flow...');
  }

  if (error) {
    console.error('Error:', error);
  }

  console.log('Registration Flow:', registrationFlow);

  return { registrationFlow, isLoading, error };
};

// 導出 hook 以便在其他地方使用
export { useCreateBrowserRegistrationFlow };
