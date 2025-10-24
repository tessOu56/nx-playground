# TODO: 創建繁體中文 README 檔案

## 目標
為所有 apps 和 libs 創建 `README.zh-TW.md` 檔案，以支援完整的多語言體驗。

## 當前狀態
- ✅ Spec 檔案：已完成所有 `zh-TW.md` (apps + libs)
- ❌ README 檔案：僅有英文版 `README.md`
- ✅ Fallback 機制：已實作，缺少繁中時會自動使用英文版

## 需要創建的檔案

### Apps (7 個)
- [ ] `apps/api-server/README.zh-TW.md`
- [ ] `apps/auth/README.zh-TW.md`
- [ ] `apps/enterprise-admin/README.zh-TW.md`
- [ ] `apps/event-cms/README.zh-TW.md`
- [ ] `apps/event-portal/README.zh-TW.md`
- [ ] `apps/profile/README.zh-TW.md`
- [ ] `apps/vue-motion/README.zh-TW.md`

### Libs (10 個)
- [ ] `libs/animation-data/README.zh-TW.md`
- [ ] `libs/api-client/README.zh-TW.md`
- [ ] `libs/auth-client/README.zh-TW.md`
- [ ] `libs/charts/README.zh-TW.md`
- [ ] `libs/design-system/README.zh-TW.md`
- [ ] `libs/enterprise-data/README.zh-TW.md`
- [ ] `libs/hooks/README.zh-TW.md`
- [ ] `libs/i18n/README.zh-TW.md`
- [ ] `libs/search-engine/README.zh-TW.md`
- [ ] `libs/tech-stack-data/README.zh-TW.md`

**總計**: 17 個檔案

## README 內容結構

參考現有的英文 README，應包含：

```markdown
# 專案名稱

簡短描述

## 功能特色

- 特色 1
- 特色 2

## 技術堆疊

- 技術 1
- 技術 2

## 安裝與使用

\`\`\`bash
# 安裝指令
pnpm install

# 開發指令
pnpm dev
\`\`\`

## 專案結構

\`\`\`
src/
  ├── components/
  ├── features/
  └── ...
\`\`\`

## 授權

MIT
```

## 優先順序

### P0 - 核心展示專案（優先翻譯）
1. `apps/profile/README.zh-TW.md` - Portfolio 網站本身
2. `apps/event-portal/README.zh-TW.md` - 活動平台前台
3. `apps/event-cms/README.zh-TW.md` - 活動管理後台

### P1 - 重要共用函式庫
4. `libs/ui-components/README.zh-TW.md` - UI 元件庫
5. `libs/design-system/README.zh-TW.md` - 設計系統
6. `libs/i18n/README.zh-TW.md` - 國際化工具
7. `libs/search-engine/README.zh-TW.md` - AI 搜尋引擎

### P2 - 其他專案與函式庫
8-17. 其餘專案

## 自動化建議

可考慮使用以下方式加速翻譯：

1. **AI 輔助翻譯**
   - 使用 ChatGPT/Claude 翻譯現有英文 README
   - 人工校對專業術語和流暢度

2. **腳本生成**
   ```bash
   # 批次複製英文版為繁中版（需要後續翻譯）
   for app in api-server auth enterprise-admin event-cms event-portal profile vue-motion; do
     cp apps/$app/README.md apps/$app/README.zh-TW.md
   done
   
   for lib in animation-data api-client auth-client charts design-system enterprise-data hooks i18n search-engine tech-stack-data; do
     cp libs/$lib/README.md libs/$lib/README.zh-TW.md
   done
   ```

3. **模板化**
   - 創建 README 模板（參考 `specs/TEMPLATES/`）
   - 確保一致性和完整性

## 驗證清單

完成每個檔案後，檢查：
- [ ] Front matter metadata 正確（如果有）
- [ ] 所有程式碼區塊保留英文（指令、變數名稱）
- [ ] 專業術語使用正確繁中翻譯
- [ ] 連結正確無誤
- [ ] 格式與英文版一致

## 相關檔案

- Fallback 機制實作: `apps/profile/src/lib/readmeLoader.ts`
- Spec 翻譯範例: `specs/apps/*/zh-TW.md`
- 模板參考: `specs/TEMPLATES/`

## 預估工時

- 每個 README 翻譯: 30-60 分鐘
- 總計: **8-17 小時** (視複雜度而定)

建議分批完成，每次 3-5 個檔案，避免疲勞。

## 進度追蹤

**最後更新**: 2025-01-24
**完成度**: 0/17 (0%)

---

*Note: 此文檔會隨著翻譯進度更新*

