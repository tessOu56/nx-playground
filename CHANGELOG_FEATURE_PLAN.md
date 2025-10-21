# CHANGELOG 讀取和展示功能

## 概念

**Profile 網站讀取各專案的 CHANGELOG.md，展示版本歷史和重大更新**

## 優勢

1. ✅ **單一資料來源** - CHANGELOG 是版本歷史的唯一真實來源
2. ✅ **自動同步** - 更新專案版本自動反映到 Profile
3. ✅ **豐富展示** - 版本歷史、重大更新、Breaking Changes
4. ✅ **時間線視圖** - 清晰的時間軸展示所有專案更新
5. ✅ **篩選和搜尋** - 可按專案、版本類型、日期篩選

## CHANGELOG 格式

**遵循 [Keep a Changelog](https://keepachangelog.com/)**：

```markdown
# Changelog

## [1.2.0] - 2025-10-21

### Added

- 技術標籤搜尋功能
- 統一標籤 UI 系統

### Changed

- 更新 design system 整合

### Fixed

- 修復路由問題

### Breaking Changes

- 移除舊的 TechBadge 組件
```

## Profile 展示位置

### 1. AppDetailPage - 版本歷史區塊

```tsx
<section>
  {/* 最新版本高亮 */}
  <LatestReleaseCard release={latestRelease} />

  {/* 重大版本里程碑 */}
  <MajorReleasesTimeline releases={majorReleases} />

  {/* 完整版本歷史（可折疊） */}
  <Collapsible>
    <AllReleasesHistory releases={allReleases} />
  </Collapsible>
</section>
```

### 2. HomePage - 最新更新區塊

```tsx
<section>
  <h2>最新更新</h2>
  <Grid>
    {projects.map(project => (
      <UpdateCard
        appId={project.id}
        version={project.latestRelease.version}
        changes={project.latestRelease.changes}
      />
    ))}
  </Grid>
</section>
```

### 3. 新頁面 - ChangelogPage

```tsx
<ChangelogPage>
  {/* 時間線視圖 */}
  <Timeline>
    {allUpdates.map(update => (
      <TimelineItem update={update} />
    ))}
  </Timeline>

  {/* 篩選器 */}
  <Filters>
    <ProjectFilter />
    <VersionTypeFilter />
    <DateRangeFilter />
  </Filters>
</ChangelogPage>
```

## 實作細節

### TypeScript 類型

```typescript
interface Release {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: {
    added?: string[];
    changed?: string[];
    fixed?: string[];
    removed?: string[];
    breaking?: string[];
  };
}

interface ProjectChangelog {
  appId: string;
  releases: Release[];
  latest: Release | null;
  major: Release[];
}
```

### 載入器

```typescript
// apps/profile/src/lib/changelogLoader.ts

export async function loadProjectChangelog(
  type: 'app' | 'lib',
  id: string
): Promise<ProjectChangelog>;

export async function loadAllChangelogs(): Promise<ProjectChangelog[]>;
```

### 合併到 ProjectData

```typescript
const projectData = {
  ...readme,
  ...spec,
  changelog: {
    releases: [...],
    latest: {...},
    major: [...],
  },
};
```

## UI 組件

### LatestReleaseCard

```tsx
<Card className='bg-blue-50 dark:bg-blue-950'>
  <Badge>v{version}</Badge>
  <span>{date}</span>

  {/* 新增功能 */}
  <Section title='✨ 新增'>
    <List items={changes.added} />
  </Section>

  {/* 變更 */}
  <Section title='🔧 變更'>
    <List items={changes.changed} />
  </Section>
</Card>
```

### MajorReleasesTimeline

```tsx
<div className='space-y-4'>
  {majorReleases.map(release => (
    <div className='border-l-4 border-primary pl-4'>
      <Badge>v{release.version}</Badge>
      {/* Breaking Changes 高亮 */}
      {release.changes.breaking && (
        <Alert variant='warning'>⚠️ Breaking Changes</Alert>
      )}
    </div>
  ))}
</div>
```

### TimelineView

```tsx
<div className='relative'>
  {/* 時間線 */}
  <div className='absolute left-8 top-0 bottom-0 w-0.5 bg-border' />

  {allChangelogs.map(({ appId, changelog }) => (
    <div key={appId}>
      <h3>{appId}</h3>
      {changelog.releases.map(release => (
        <ReleaseNode release={release} />
      ))}
    </div>
  ))}
</div>
```

## 導航更新

```tsx
// Layout.tsx

<Button onClick={() => navigate('/changelog')}>更新日誌</Button>
```

## 實作檢查清單

- [ ] 建立 CHANGELOG.md 解析器
- [ ] 建立 TypeScript 類型
- [ ] 實作載入器
- [ ] 建立 UI 組件（LatestReleaseCard, Timeline 等）
- [ ] 整合到 AppDetailPage
- [ ] 建立 HomePage 最新更新區塊
- [ ] 建立 ChangelogPage
- [ ] 添加路由和導航
- [ ] 測試各種 CHANGELOG 格式

## 額外功能（未來）

- RSS Feed for changelog
- Email notification for new releases
- Compare versions (diff view)
- Download changelog as PDF
- Filter by severity (major/minor/patch)
