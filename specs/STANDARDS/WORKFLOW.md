# PRD 維護工作流程

## 開發流程

```
1. Code-First 開發 Feature
   ↓
2. 測試 & 確認版本
   ↓
3. 更新專案 README
   ↓
4. 🔔 檢查是否需要更新 PRD
   ↓
5. 更新 PRD（如果需要）
   ↓
6. 同步 i18n
   ↓
7. Commit（觸發 pre-commit 檢查）
   ↓
8. Profile 自動讀取最新內容
```

## 何時更新 PRD？

### 必須更新
- ✅ 新增核心功能
- ✅ 專案狀態變更（development → production）
- ✅ 重大版本更新（MAJOR 版本）
- ✅ 產品定位調整

### 可選更新
- 🔸 Minor 版本更新
- 🔸 新增次要功能
- 🔸 效能優化
- 🔸 Bug 修復

### 無需更新
- ❌ Patch 版本更新（純 bug 修復）
- ❌ 程式碼重構（不影響功能）
- ❌ 文檔修正
- ❌ 測試更新

## PRD 更新檢查清單

### 基本檢查
- [ ] `version` 是否與專案版本一致？
- [ ] `lastUpdated` 是否為今天日期？
- [ ] `status` 是否需要調整？
- [ ] `published` 是否正確？

### 內容檢查
- [ ] `shortDesc` 是否需要更新？
- [ ] `highlights` 是否新增亮點？
- [ ] `useCases` 是否有新場景？
- [ ] `stats` 數據是否需要更新？（Libs）

### 治理檢查
- [ ] `reviewer` 是否正確？
- [ ] `approvalStatus` 是否需要變更？
- [ ] `draftStatus` 是否為 false？

### i18n 檢查
- [ ] 中文版已更新？
- [ ] 英文版已同步？
- [ ] 執行 `pnpm run prd:sync`？

## 詳細步驟

### Step 1: 更新 README

```bash
# 編輯專案 README
vim apps/profile/README.zh-TW.md

# 更新 Front Matter
---
version: '1.2.0'  # 新版本
lastUpdated: '2025-10-21'  # 今天日期
features:
  - 新功能  # 新增這行
  - ...
---
```

### Step 2: 更新專案 CHANGELOG

```bash
# 編輯 CHANGELOG
vim apps/profile/CHANGELOG.md

# 新增版本記錄
## [1.2.0] - 2025-10-21

### Added
- 技術標籤搜尋功能

### Changed
- ...
```

### Step 3: 檢查是否需要更新 PRD

```bash
# 運行檢查腳本
node specs/.scripts/check-prd-freshness.js

# 如果需要更新，繼續 Step 4
# 如果不需要，跳到 Step 7
```

### Step 4: 更新 PRD（如需要）

```bash
# 編輯中文 PRD
vim specs/apps/profile/zh-TW.md

# 更新 Front Matter
---
version: '1.2.0'  # 同步專案版本
lastUpdated: '2025-10-21'  # 今天日期
highlights:
  - 技術標籤搜尋  # 新增亮點
  - ...
---

# 更新內容
## 功能需求

### FR-5: 技術標籤搜尋（新增）
- 使用者可以點擊技術標籤
- ...
```

### Step 5: 同步英文 PRD

```bash
# 編輯英文 PRD
vim specs/apps/profile/en.md

# 翻譯中文版的變更
# 確保 version 和 lastUpdated 一致
```

### Step 6: 執行 i18n 同步檢查

```bash
# 運行同步檢查
pnpm run prd:sync

# 或直接運行腳本
node specs/.scripts/sync-i18n.js

# 確認輸出顯示 ✅ 同步成功
```

### Step 7: Commit

```bash
# 一次 commit 包含所有變更
git add .
git commit -m "feat(profile): 新增技術標籤搜尋

- 新增標籤點擊跳轉功能
- 更新 README 和 PRD
- 版本更新到 v1.2.0"

# pre-commit hook 會自動檢查：
# 1. PRD i18n 同步
# 2. 版本號一致性
# 3. Front Matter 完整性
```

### Step 8: 更新 PRD CHANGELOG（可選）

```bash
# 如果是重大 PRD 變更，更新 PRD CHANGELOG
vim specs/apps/profile/CHANGELOG.md

## [1.2.0] - 2025-10-21

### Updated Sections
- highlights: 新增「技術標籤搜尋」

### New Requirements
- FR-5: 技術標籤搜尋功能

### Reviewer
- tessou (2025-10-21)
```

## 自動化提醒

### Pre-commit Hook

當你 commit 包含 `feat:` 時，會自動檢查：

```
🔍 檢查 PRD 更新狀態...

⚠️  檢測到 feature commit，但 PRD 未更新
💡 建議更新 PRD: specs/apps/profile/zh-TW.md

確定要繼續 commit 嗎？(y/n)
```

### AI 助手提醒

在 `.cursorrules` 中設定，AI 會在以下情況提醒：

- Commit 包含 `feat:` 或 `feat(`
- package.json 版本更新
- README 的 features 列表更新

## 常見問題

### Q: 什麼時候需要更新 PRD？

**A**: 當專案功能、定位、狀態有重大變更時。Bug 修復、重構等不需要更新。

### Q: 忘記同步英文版怎麼辦？

**A**: pre-commit hook 會檢查並阻止 commit。補上英文版後重新 commit。

### Q: PRD 版本號錯誤怎麼辦？

**A**: 修正後重新 commit，或使用 `git commit --amend` 修改。

### Q: 如何跳過 pre-commit 檢查？

**A**: 不建議跳過。如果必要，使用 `git commit --no-verify`（不推薦）。

## 快速參考

### 指令速查

```bash
# 檢查 PRD 新鮮度
node specs/.scripts/check-prd-freshness.js

# 同步 i18n
pnpm run prd:sync

# 驗證 Front Matter
node specs/.scripts/validate-frontmatter.js

# 檢查版本一致性
node specs/.scripts/check-version.js
```

### PRD 位置

```
Apps: specs/apps/{appId}/zh-TW.md 和 en.md
Libs: specs/libs/{libId}/zh-TW.md 和 en.md
```

### 相關文檔

- `specs/STANDARDS/README_SPEC.md` - README 規範
- `specs/STANDARDS/PRD_SPEC.md` - PRD 規範
- `.cursorrules` - Cursor 工作流程規則

