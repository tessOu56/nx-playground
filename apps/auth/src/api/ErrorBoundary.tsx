import { Component, ReactNode } from 'react';
import { toast } from 'sonner';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    toast.error(`應用錯誤：${error.message}`, {
      duration: Infinity,
      closeButton: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return <div className='text-red-500 p-4'>發生錯誤，請重新整理。</div>;
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
