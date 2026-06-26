import * as fs from 'fs';
import * as path from 'path';

import { defineConfig } from 'orval';

// Environment variables, default to 'dev'
const ENV = process.env.API_ENV ?? 'dev';
const API_MODULE = process.env.API_MODULE ?? 'form';

// Scan the specs dir to find the spec file matching the module/env
function findApiSpec(module: string, env: string): string {
  const specsDir = './specs';
  const possibleFiles = [
    `${module}-${env}.openapi.yaml`,
    `${module}-${env}.yaml`,
    `${module}-v${env}.openapi.yaml`,
    `${module}-v${env}.yaml`,
    // env-less specs (e.g. event.openapi.yaml) - fallback before default
    `${module}.openapi.yaml`,
    `${module}.yaml`,
  ];

  for (const file of possibleFiles) {
    const filePath = path.join(specsDir, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  // Fall back to a default openapi.yaml if present
  const defaultFile = path.join(specsDir, 'openapi.yaml');
  if (fs.existsSync(defaultFile)) {
    console.warn(
      `Warning: No API spec found for ${module}-${env}, using default openapi.yaml`
    );
    return defaultFile;
  }

  throw new Error(
    `No API spec file found for module ${module} and environment ${env}`
  );
}

// Build the output directory path
function getOutputPath(module: string, env: string): string {
  return `./src/generated/${module}/${env}`;
}

const apiSpecPath = findApiSpec(API_MODULE, ENV);
const outputPath = getOutputPath(API_MODULE, ENV);

export default defineConfig({
  'nx-playground': {
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
