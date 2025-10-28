# Progress Report Specification

**Version**: 1.0.0  
**Last Updated**: 2025-01-27  
**Status**: Active

---

## 目的

定義進度報告的格式、命名與存放規範，確保專案進度可追蹤、可查詢、格式一致。

---

## 何時創建進度報告

### ✅ 必須創建的情況

1. **多階段重構任務**
   - 例：Clean Code Audit (6 phases)
   - 例：Feature Migration (3+ phases)

2. **重大功能開發**
   - 例：AI Search Implementation
   - 例：Backend Integration Complete

3. **大規模清理或遷移**
   - 例：docs/ → specs/ migration
   - 例：Console.log → Logger replacement

4. **每日開發進度總結**（可選）
   - 每日收工前的進度記錄
   - 幫助追蹤長期任務進展

### ❌ 不需要創建的情況

- 單一檔案的小修改
- Bug 修復（除非是重大 bug 的系統性修復）
- 文檔小幅更新
- 依賴套件更新

---

## 檔案命名規範

### 格式

```
{TYPE}_{YYYY-MM-DD}.md
```

### Type 分類

| Type | 說明 | 範例 |
|------|------|------|
| `DAILY` | 每日進度 | `DAILY_2025-01-27.md` |
| `CLEANUP` | 程式碼清理 | `CLEANUP_2025-01-27.md` |
| `REFACTOR` | 重構任務 | `REFACTOR_SEARCH_2025-01-27.md` |
| `FEATURE` | 功能開發 | `FEATURE_AI_SEARCH_2025-01-27.md` |
| `MIGRATION` | 遷移任務 | `MIGRATION_DOCS_TO_SPECS_2025-01-27.md` |
| `INTEGRATION` | 整合任務 | `INTEGRATION_SUPABASE_2025-01-27.md` |

### 命名原則

1. **Type 使用大寫**：`CLEANUP` not `cleanup`
2. **日期格式固定**：`YYYY-MM-DD`
3. **任務名稱簡短**：1-3 個單字
4. **使用底線分隔**：`_` not `-` or space

---

## 檔案結構

### 必須包含的 Section

```markdown
# {Task Name} - Completion Summary

**Date**: YYYY-MM-DD
**Status**: ✅ Complete / 🚧 In Progress / ❌ Failed
**Commits**: N commits (hash1, hash2, ...)

---

## 📊 Summary

| Phase | Task | Status | Files Changed |
|-------|------|--------|---------------|
| 1 | Task 1 | ✅ Complete | N files |
| 2 | Task 2 | ✅ Complete | N files |
| **Total** | | **Status** | **Total files** |

---

## Phase Details

### Phase 1: {Phase Name} ✅

**Goal**: {What you want to achieve}

**Actions**:
- Action 1
- Action 2
- Action 3

**Files Modified**: N
- ✅ File 1
- ✅ File 2

**Result**: 
- ✅ Result 1
- ✅ Result 2

---

## 🎯 Impact Summary

### Code Quality ✅

**Before**:
- ❌ Issue 1
- ❌ Issue 2

**After**:
- ✅ Improvement 1
- ✅ Improvement 2

### Developer Experience ✅

**New Standards**:
1. Standard 1
2. Standard 2

**Documentation**:
- Doc location 1
- Doc location 2

### Observability ✅ (if applicable)

**Logger Integration**:
- Component 1
- Component 2

**Structured Logging**:
```typescript
// Example code
```

---

## 📈 Statistics

### Files Changed
- **Total**: N files
- **Created**: N files
- **Updated**: N files
- **Deleted**: N files

### Lines of Code
- **Feature**: N lines
- **Documentation**: N lines

### Commits
1. `hash1` - Description
2. `hash2` - Description

---

## ✅ Acceptance Criteria

### Phase 1: {Phase Name}
- [x] Criterion 1
- [x] Criterion 2
- [ ] Criterion 3

### Phase 2: {Phase Name}
- [x] Criterion 1
- [x] Criterion 2

---

## 🚀 Next Steps

### Immediate
1. ✅ Task 1 (if complete)
2. 🚧 Task 2 (if in progress)
3. ⏳ Task 3 (if pending)

### Future Enhancements
1. Enhancement 1
2. Enhancement 2

---

## 📝 Notes

### Important Reminders
- Note 1
- Note 2

### Known Issues
- Issue 1
- Issue 2

### References
- Doc 1
- Doc 2

---

**Completion Date**: YYYY-MM-DD
**Total Time**: ~N hours
**Result**: ✅ Success - Summary of achievement
```

---

## 存放位置

### ✅ 正確位置

```
specs/PROGRESS/
├── DAILY_2025-01-27.md
├── CLEANUP_2025-01-27.md
├── FEATURE_AI_SEARCH_2025-01-28.md
└── MIGRATION_DOCS_TO_SPECS_2025-01-27.md
```

### ❌ 錯誤位置

- ❌ 專案根目錄 (`/CLEANUP_SUMMARY.md`)
- ❌ Apps 目錄 (`apps/profile/PROGRESS.md`)
- ❌ Docs 目錄（已廢棄）
- ❌ 任意其他位置

---

## 撰寫原則

### 1. 使用表格總覽

清晰呈現多階段任務的完成狀態：

```markdown
| Phase | Task | Status | Files Changed |
|-------|------|--------|---------------|
| 1 | PWA Icons | ✅ Complete | 3 files |
| 2 | Archive Scripts | ✅ Complete | 4 files |
```

### 2. 使用 Emoji 增強可讀性

- ✅ Complete
- 🚧 In Progress
- ❌ Failed / Issue
- ⏳ Pending
- 📊 Summary
- 🎯 Impact
- 📈 Statistics
- 🚀 Next Steps
- 📝 Notes

### 3. Before/After 對比

清楚呈現改善效果：

```markdown
**Before**:
- ❌ 30+ console.log scattered
- ❌ No logging context

**After**:
- ✅ 0 console.* in production
- ✅ Structured logging with context
```

### 4. 程式碼範例

關鍵改變要有程式碼範例：

```markdown
**Before**:
\`\`\`typescript
console.error('Error:', error);
\`\`\`

**After**:
\`\`\`typescript
logger.error('Failed to load data', error, { id, locale });
\`\`\`
```

### 5. 統計數據

量化改善成果：

- 檔案修改數量
- 程式碼行數
- Commits 數量
- 時間投入

---

## 範例參考

完整範例請參考：`specs/PROGRESS/CLEANUP_2025-01-27.md`

---

## Checklist

在完成進度報告前，檢查：

- [ ] 檔案命名正確（TYPE_YYYY-MM-DD.md）
- [ ] 放在 `specs/PROGRESS/` 目錄
- [ ] 包含所有必要 section
- [ ] Summary 表格完整
- [ ] Phase Details 詳細說明
- [ ] Impact Summary 清楚呈現
- [ ] Statistics 量化數據
- [ ] Acceptance Criteria 勾選完成
- [ ] Next Steps 明確列出
- [ ] Notes 記錄重要資訊
- [ ] 使用 Emoji 增強可讀性
- [ ] 程式碼範例格式正確
- [ ] Before/After 對比清晰

---

## 版本歷史

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-27 | Initial specification |

---

**維護者**: Development Team  
**審核者**: Project Manager  
**參考文件**: 
- `specs/STANDARDS/PRD_SPEC.md`
- `specs/STANDARDS/README_SPEC.md`
- `specs/STANDARDS/WORKFLOW.md`

