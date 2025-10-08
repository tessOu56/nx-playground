import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Turnstile from 'react-turnstile';

export type CustomTurnstileRef = {
  reset: () => void;
};

const CustomTurnstile = forwardRef<CustomTurnstileRef, any>((props, ref) => {
  const innerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    reset() {
      // 呼叫內部的 turnstile.reset()
      innerRef.current?.reset?.();
    },
  }));

  // 這裡是關鍵：斷言 Turnstile 是可以用 ref 的
  const TurnstileWithRef = Turnstile as React.ForwardRefExoticComponent<any>;

  return <TurnstileWithRef {...props} ref={innerRef} />;
});

export default CustomTurnstile;
