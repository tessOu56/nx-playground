//@ts-check
import path from 'path';
import { fileURLToPath } from 'url';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import createNextIntlPlugin from 'next-intl/plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@nx-playground/ui-components',
    '@nx-playground/design-system',
    '@nx-playground/i18n',
    '@nx-playground/api-client',
    '@nx-playground/auth-client',
    '@nx-playground/hooks',
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'picsum.photos'],
  },
  // 配置開發環境指示器
  devIndicators: {
    position: 'bottom-right',
  },
  // 允許開發環境的跨域請求
  allowedDevOrigins: ['frontend.oosa.life'],
  // 簡化的 Safari 相容性配置 - 僅在非靜態導出時啟用
  ...(process.env.NODE_ENV !== 'production' && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'unsafe-none',
            },
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'unsafe-none',
            },
          ],
        },
      ];
    },
  }),
  // 啟用編譯優化
  experimental: {
    optimizeCss: false, // 暫時禁用以避免 critters 問題
    optimizePackageImports: [
      '@nx-playground/ui-components',
      '@nx-playground/design-system',
    ],
  },
  // 優化編譯設定
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 添加 React 嚴格模式配置
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // 簡化 webpack 配置
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };

    // 根據環境動態設置設計系統路徑
    const isProduction = process.env.NODE_ENV === 'production';
    const designSystemBasePath = path.resolve(
      __dirname,
      '../../dist/libs/design-system/src'
    );

    console.log('🎨 設計系統路徑:', designSystemBasePath);
    console.log('🎨 環境:', isProduction ? 'production' : 'development');

    config.resolve.alias = {
      ...config.resolve.alias,
      '@design-system': designSystemBasePath,
    };

    // 優化模組解析
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // 簡化模組解析順序
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];

    // 解決 react-hook-form 在 SSR 中的問題
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('react-hook-form');
    }

    return config;
  },
};

const withNextIntl = createNextIntlPlugin('./next-intl-config.ts');
const withVanillaExtract = createVanillaExtractPlugin();

export default withNextIntl(withVanillaExtract(nextConfig));
