import * as fs from 'fs';
import * as path from 'path';

import { defineConfig } from 'orval';

// 獲取環境變數，默認為 'dev'
const ENV = process.env.API_ENV ?? 'dev';
const API_MODULE = process.env.API_MODULE ?? 'form';

// 掃描 specs 目錄，找到對應環境的 API 規格文件
function findApiSpec(module: string, env: string): string {
  const specsDir = './specs';
  const possibleFiles = [
    `${module}-${env}.openapi.yaml`,
    `${module}-${env}.yaml`,
    `${module}-v${env}.openapi.yaml`,
    `${module}-v${env}.yaml`,
  ];

  for (const file of possibleFiles) {
    const filePath = path.join(specsDir, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  // 如果找不到對應環境的文件，使用默認的 openapi.yaml
  const defaultFile = path.join(specsDir, 'openapi.yaml');
  if (fs.existsSync(defaultFile)) {
    console.warn(
      `⚠️  Warning: No API spec found for ${module}-${env}, using default openapi.yaml`
    );
    return defaultFile;
  }

  throw new Error(
    `No API spec file found for module ${module} and environment ${env}`
  );
}

// 生成輸出目錄路徑
function getOutputPath(module: string, env: string): string {
  return `./src/generated/${module}/${env}`;
}

const apiSpecPath = findApiSpec(API_MODULE, ENV);
const outputPath = getOutputPath(API_MODULE, ENV);

export default defineConfig({
  nx-playground: {
    input: {
      target: apiSpecPath,
    },
    output: {
      mode: 'split',
      target: outputPath,
      schemas: `${outputPath}/model`,
      client: 'react-query',
      prettier: true,
      clean: true,
      override: {
        mutator: {
          path: './src/lib/api-client.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
        components: {
          schemas: {
            suffix: 'Schema',
          },
          responses: {
            suffix: 'Response',
          },
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
