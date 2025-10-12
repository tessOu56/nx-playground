declare module 'qr-code-styling' {
  export interface QRCodeStylingOptions {
    width?: number;
    height?: number;
    type?: 'svg' | 'canvas';
    data: string;
    dots?: {
      color?: string;
      type?: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
    };
    background?: string;
    image?: string;
    imageOptions?: {
      hideBackgroundDots?: boolean;
      imageSize?: number;
      margin?: number;
    };
    cornersSquare?: {
      type?: 'dot' | 'square' | 'extra-rounded';
      color?: string;
    };
    cornersDot?: {
      type?: 'dot' | 'square';
      color?: string;
    };
    margin?: number;
  }

  export interface DownloadOptions {
    name?: string;
    extension?: 'png' | 'svg';
  }

  export default class QRCodeStyling {
    constructor(options: QRCodeStylingOptions);
    append(container: HTMLElement): void;
    update(options: Partial<QRCodeStylingOptions>): void;
    download(options?: DownloadOptions): void;
    getRawData(): string;
  }
}
