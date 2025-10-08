import { type FC } from 'react';

interface DropZoneProps {
  position: number;
  onDrop: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  isDragOver?: boolean;
}

export const DropZone: FC<DropZoneProps> = ({
  position,
  onDrop,
  isDragOver,
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // 設置子元件的背景色
    const childElement = e.currentTarget.querySelector('div');
    if (childElement) {
      childElement.style.backgroundColor = 'rgb(191 219 254)'; // bg-blue-300
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // 清除子元件的背景色
    const childElement = e.currentTarget.querySelector('div');
    if (childElement) {
      childElement.style.backgroundColor = 'transparent';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // 清除子元件的背景色
    const childElement = e.currentTarget.querySelector('div');
    if (childElement) {
      childElement.style.backgroundColor = 'transparent';
    }
    onDrop(e, position);
  };

  return (
    <div
      className='p-2 group bg-transparent'
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`h-1 bg-transparent transition-colors rounded  ${
          isDragOver ? 'bg-blue-200' : 'bg-transparent'
        }`}
      />
    </div>
  );
};
