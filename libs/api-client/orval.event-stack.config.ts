import { defineConfig } from 'orval';

export default defineConfig({
  'event-stack': {
    input: {
      target: './specs/event-stack.openapi.yaml',
    },
    output: {
      mode: 'split',
      target: './src/event-stack/generated',
      schemas: './src/event-stack/generated/model',
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
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
