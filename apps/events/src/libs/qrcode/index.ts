// === Core === //
export * from './core/types';
export * from './core/utils';
export * from './core/generator';

// === Hooks === //
export * from './hooks/useQRCodeImage';

// === Components === //
export { QRCodeImage } from './components/QRCodeImage';
export { QRCodeModal } from './components/QRCodeModal';
export { QRCodeSection } from './components/QRCodeSection';
export { QRCodeThemeBadge as QRCodeBadge } from './components/QRCodeBadge';

// === Legacy Exports (for backward compatibility) === //
export { QRCodeThemeBadge } from './components/QRCodeBadge';
