// 重新導出 @nx-playground/ui-components 的所有組件
export * from '@nx-playground/ui-components';

// 導出封裝的組件（覆蓋原始組件）
export { Button } from './Button';
export { Image } from './Image';
export { LineOfficialButton } from './LineOfficialButton';
export { Carousel } from './Carousel';

// 導出 Skeleton 組件（使用本地封裝）
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  type SkeletonProps,
  type SkeletonTextProps,
  type SkeletonAvatarProps,
  type SkeletonCardProps,
} from './Skeleton';
