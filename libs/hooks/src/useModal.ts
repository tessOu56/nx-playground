import { useCallback, useState } from 'react';

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

/**
 * useModal - Modal 狀態管理 Hook
 *
 * @param initialState - 初始開啟狀態，預設為 false
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const modal = useModal();
 *
 *   return (
 *     <>
 *       <button onClick={modal.open}>開啟 Modal</button>
 *       <Dialog open={modal.isOpen} onOpenChange={modal.setOpen}>
 *         <DialogContent>
 *           <DialogTitle>標題</DialogTitle>
 *           <DialogDescription>內容</DialogDescription>
 *           <button onClick={modal.close}>關閉</button>
 *         </DialogContent>
 *       </Dialog>
 *     </>
 *   );
 * }
 * ```
 */
export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const setOpen = useCallback((value: boolean) => {
    setIsOpen(value);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen,
  };
}
