module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 類型必須是以下之一
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修復 bug
        'docs', // 文檔更新
        'style', // 代碼格式調整
        'refactor', // 重構
        'perf', // 性能優化
        'test', // 測試相關
        'chore', // 構建過程或輔助工具的變動
        'ci', // CI 配置變更
        'build', // 構建系統或外部依賴變更
        'revert', // 回滾
        'wip', // 開發中
        'temp', // 臨時提交
      ],
    ],
    // 類型不能為空
    'type-empty': [2, 'never'],
    // 主題不能為空
    'subject-empty': [2, 'never'],
    // 主題不能以句號結尾
    'subject-full-stop': [2, 'never', '.'],
    // 主題最大長度
    'subject-max-length': [2, 'always', 72],
    // 主題最小長度
    'subject-min-length': [2, 'always', 3],
    // 主題必須以小寫開頭
    'subject-case': [2, 'always', 'lower-case'],
    // 正文必須以空行開頭
    'body-leading-blank': [2, 'always'],
    // 正文最大長度
    'body-max-line-length': [2, 'always', 100],
    // 腳註必須以空行開頭
    'footer-leading-blank': [2, 'always'],
    // 腳註最大長度
    'footer-max-line-length': [2, 'always', 100],
    // 範圍必須是小寫
    'scope-case': [2, 'always', 'lower-case'],
    // 範圍格式
    'scope-enum': [
      2,
      'always',
      [
        'auth', // 認證相關
        'ui', // UI 組件
        'api', // API 相關
        'design', // 設計系統
        'build', // 構建系統
        'deps', // 依賴管理
        'docs', // 文檔
        'test', // 測試
        'ci', // CI/CD
        'config', // 配置
        'core', // 核心功能
        'feat', // 新功能
        'fix', // 修復
        'refactor', // 重構
        'style', // 樣式
        'chore', // 雜項
      ],
    ],
  },
};
