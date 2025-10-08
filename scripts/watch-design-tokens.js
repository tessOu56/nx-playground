const { exec } = require('child_process');
const path = require('path');

const chokidar = require('chokidar');

console.log('👀 Watching design tokens for changes...');

const designSystemDir = path.join(__dirname, '..', 'libs', 'design-system');
const sourceDir = path.join(designSystemDir, 'src', 'tokens', 'source');
const rawDir = path.join(designSystemDir, 'src', 'tokens', 'raw');

const watcher = chokidar.watch(
  [path.join(sourceDir, '**/*.css'), path.join(rawDir, '**/*.json')],
  {
    persistent: true,
    ignoreInitial: false,
  }
);

watcher
  .on('ready', () => {
    console.log('✅ Design token watcher ready');
    console.log(`📁 Watching source directory: ${sourceDir}`);
    console.log(`📁 Watching raw directory: ${rawDir}`);
  })
  .on('change', (filePath) => {
    console.log(`🔄 Design token file changed: ${path.basename(filePath)}`);
    console.log('🏗️  Rebuilding design tokens...');

    exec(
      'pnpm run tokens:build',
      {
        cwd: designSystemDir,
      },
      (error, stdout, _stderr) => {
        if (error) {
          console.error('❌ Design token build failed:', error);
          return;
        }
        console.log('✅ Design tokens rebuilt successfully');
        console.log(stdout);
      }
    );
  })
  .on('error', (error) => {
    console.error('❌ Design token watcher error:', error);
  });

console.log('Press Ctrl+C to stop watching design tokens');
