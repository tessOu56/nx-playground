import { useEffect, useState } from 'react';

interface UseFileUploadOptions {
  maxSizeMB?: number;
  initFile?: File | null;
  onFileRead?: (file: File, dataUrl: string) => void;
}

export const useFileUpload = ({
  maxSizeMB = 8,
  initFile,
  onFileRead,
}: UseFileUploadOptions = {}) => {
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileDataUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileDataUrl(result);
      if (onFileRead) onFileRead(file, result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!initFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(initFile);
  }, [initFile]);

  const cleanUrl = () => {
    setFileDataUrl(null);
  };

  return { fileDataUrl, cleanUrl, handleFileChange, setFileDataUrl };
};
