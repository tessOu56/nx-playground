import { toast } from 'sonner';
export function handleRedirect(url: string) {
  if (url) {
    window.location.href = url;
  } else {
    toast.error('Redirect URL is missing in headers', {
      duration: Infinity,
      closeButton: true,
    });
  }
}
