---
id: event-cms
version: 0.1.0
lastUpdated: '2025-10-24'
category: react
status: development
published: true

shortDesc: |
  活動內容管理系統，用於建立和管理活動。
  使用 React、TypeScript 與現代化表單處理。

purpose: |
  活動管理後台系統，用於建立、編輯和發布活動。
  展示複雜表單處理、狀態管理與後台介面設計能力。

highlights:
  - 多步驟表單精靈
  - Rich text 編輯器整合
  - 圖片上傳與管理
  - 草稿與發布流程
  - 角色權限控制準備
  - 即時預覽

useCases:
  - 活動主辦方管理活動內容
  - 管理員建立與編輯活動
  - 內容工作流程展示
  - 複雜表單處理範例

targetAudience: |
  展示企業級應用的後台介面設計與複雜表單管理能力。

reviewer: tessou
reviewedAt: '2025-10-24'
nextReview: '2025-11-24'
updateFrequency: per-feature
draftStatus: false
approvalStatus: approved

lastSync: '2025-10-24'
---

# Event CMS - 活動內容管理系統

用於建立、編輯和管理活動的後台介面，具備豐富的內容編輯功能。

## 核心功能
- 活動 CRUD 操作
- Zod 表單驗證
- Zustand 狀態管理
- 響應式後台 UI
- 多步驟表單精靈
- Rich text 編輯器整合

---

## 進度與規劃

### 目前狀態
- **版本**: 0.1.0
- **完成度**: 70%
- **階段**: 開發中
- **最後更新**: 2025-01-24

### 已完成功能
- ✅ 多步驟活動建立表單
- ✅ React Hook Form + Zod 表單驗證
- ✅ Zustand 狀態管理
- ✅ 拖拉式表單建構器 UI
- ✅ 響應式後台介面
- ✅ 活動列表與卡片元件
- ✅ 基本 CRUD 操作（前端）

### 進行中
- 🚧 與後端 API 整合
- 🚧 圖片上傳功能
- 🚧 草稿/發布工作流程

### 下一步（Roadmap）

**P0 - 關鍵** (2-3 週):
- [ ] 完成與 api-server 的 API 整合
- [ ] 實作圖片上傳服務
- [ ] 草稿與發布工作流程
- [ ] 表單驗證增強

**P1 - 高優先** (1 個月):
- [ ] 活動描述 Rich text 編輯器
- [ ] 批次操作（刪除、發布）
- [ ] 活動分析儀表板
- [ ] 角色權限控制

**P2 - 中優先**:
- [ ] 活動範本
- [ ] 複製活動功能
- [ ] 匯出活動資料（CSV, JSON）
- [ ] 審計日誌

### 技術債務
- API 整合尚未完成
- 圖片上傳需要後端支援
- 測試覆蓋率：0%（目標 60%+）
- 錯誤處理需要改進

### 相依性
- 需要：`api-server` 提供活動管理 endpoints
- 需要：圖片儲存服務（S3/Cloudflare R2）
- 需要：認證整合

### Changelog
正式發布後開始追蹤版本歷史

