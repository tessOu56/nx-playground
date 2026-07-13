# Agent Profile — nx-playground

> **GENERATED — do not edit.** 產生器：`scripts/build-agent-profiles.py`；業務維度 SSOT：`registry/business-profiles.json`；其餘由既有 registry 合成。
> 來源版本：business-profiles 2026-07-09 · agent-assets 2026-07-09 · domain-spec unknown
> ⚠️ 業務維度為 **draft**，owner 確認後轉 confirmed。

## 業務（為何存在）

- **問題**：企業級前端能力（多框架、monorepo 管治、契約鏈、RBAC 後台）需要可驗證的實作證據場，而非只在履歷上宣稱。
- **使用者**：本人（能力練兵與證據累積）、招聘方/面試官（經 mirror 展示）、生態其他 repo（模式與 lib 引用來源）
- **價值主張**：跨框架企業前端實驗場：成熟能力經 SDK/契約模式升級進正式產品，經 standalone mirror 對外展示；同時是 module→feature 重構練兵場與 mobile 線落點。
- **成功指標**：labs→產品晉升數、contracts 破壞性變更攔截數、build/cache 時間（affected）、重構 before/after 耦合數

## 詞彙（這個 repo 說什麼語言）

| 詞 | 定義 | 生態對照 |
| --- | --- | --- |
| `monorepo` | ⚠️ domain spec 未收錄 | — |
| `affected-graph` | ⚠️ domain spec 未收錄 | — |
| `mirror` | ⚠️ domain spec 未收錄 | — |
| `promote` | ⚠️ domain spec 未收錄 | — |
| `feature-based-architecture` | ⚠️ domain spec 未收錄 | — |
| `contract-first` | ⚠️ domain spec 未收錄 | — |

## 技術（agent 可用什麼）

- **進場檔**：agentsMd
- **Skills**：無
- **Rules**：無
- **Code graph**：nx.json + graph.json（committed，~126KB）
- **能力域（capabilities.json owner）**：跨框架前端樞紐（Contract → typed SDK 產生/發佈（TypeSpec/OpenAPI SSOT）、Micro-frontends（Nx Module Federation host + remotes）、Realtime client 接入示範（通知 feed））

## 目標（現在往哪走）

- **currentFocus**：T-ds-2026-002 @explore-design/sdk 接入 libs/design-system · T-2026-018 TypeSpec → OpenAPI spike · T-2026-009 libs/charts dashboard
- **中央規劃**：`planning/projects/nx-playground.md`

## 邊界（不要做什麼）

- 依該 repo `AGENTS.md` 禁止段與 `planning/projects/nx-playground.md`「不做」清單為準。
- 備註：mirror 源頭；mobile 線 apps/mobile-approvals（≤4h/週）
