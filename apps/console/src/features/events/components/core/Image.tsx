import React from 'react';

import checker from '../../../../assets/checker.png';

type Prop = {
  children?: React.ReactNode;
  className?: string;
  src?: string | null;
  alt?: string;
  aspectRatio?: string;

  onClick?: () => void;
};

export const Image: React.FC<Prop> = ({
  children,
  className = '',
  src,
  alt = 'there is error',
  aspectRatio = '2/1',
  onClick,
}) => {
  return (
    <img
      src={src ?? checker}
      alt={alt}
      onClick={onClick}
      className={`${className}`}
      style={{ aspectRatio }}
    >
      {children}
    </img>
  );
};
