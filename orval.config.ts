import { defineConfig } from 'orval';

export default defineConfig({
  reactSdk: {
    input: {
      // 這裡可以指向你的 OpenAPI spec 文件或 URL
      // 例如: './openapi.json' 或 'https://api.example.com/openapi.json'
      target: './openapi.json',
    },
    output: {
      mode: 'split',
      target: './libs/api-client/src/generated',
      schemas: './libs/api-client/src/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './libs/api-client/src/lib/api-client.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'pageParam',
        },
        // mutation: {
        //   useMutation: true,
        // },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
