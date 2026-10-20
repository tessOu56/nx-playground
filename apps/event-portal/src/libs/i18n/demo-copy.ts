export type DemoLocale = 'zh-TW' | 'en' | 'ja';

export function isEnLocale(locale: string | undefined): boolean {
  return locale === 'en';
}

export function isJaLocale(locale: string | undefined): boolean {
  return locale === 'ja';
}

function t(
  locale: string | undefined,
  zh: string,
  en: string,
  ja?: string
): string {
  if (isJaLocale(locale)) return ja ?? en;
  if (isEnLocale(locale)) return en;
  return zh;
}

export function demoCopy(locale: string | undefined) {
  return {
    siteName: t(
      locale,
      'NX Playground 展覽',
      'NX Playground Exhibitions',
      'NX Playground 展覧会'
    ),
    navEvents: t(locale, '展覽', 'Exhibitions', '展覧会'),
    navLine: t(locale, 'LINE', 'LINE', 'LINE'),
    logout: t(locale, '登出', 'Log out', 'ログアウト'),
    upcoming: t(locale, '即將開始', 'Upcoming', '開催予定'),
    upcomingLead: t(
      locale,
      '搜尋台北與東京的展覽，打開詳情後再到官方頁面或 LINE 確認。',
      'Search exhibitions in Taipei and Tokyo, then open the official page or ask on LINE.',
      '台北と東京の展覧会を探し、公式ページか LINE で確認します。'
    ),
    eventCount: (n: number) =>
      t(locale, `${n} 筆`, `${n} listings`, `${n} 件`),
    viewSessions: t(locale, '查看會期', 'View dates', '会期を見る'),
    speakers: t(locale, '相關', 'Related', '関連'),
    speakerCount: (n: number) =>
      t(locale, `${n} 位`, `${n} people`, `${n} 人`),
    venue: t(locale, '場地', 'Venue', '会場'),
    when: t(locale, '會期', 'Dates', '会期'),
    price: t(locale, '入場', 'Admission', '料金'),
    organizer: t(locale, '主辦', 'Organizer', '主催'),
    location: t(locale, '地點', 'Location', '場所'),
    city: t(locale, '城市', 'City', '都市'),
    faq: t(locale, '常見問題', 'FAQ', 'よくある質問'),
    about: t(locale, '介紹', 'About', '紹介'),
    openOsm: t(
      locale,
      '在 OpenStreetMap 開啟',
      'Open in OpenStreetMap',
      'OpenStreetMap で開く'
    ),
    mapTitle: t(locale, '場地地圖', 'Venue map', '会場マップ'),
    guestSignup: t(
      locale,
      '可直接瀏覽，不必先登入。',
      'Browse without signing in.',
      'ログインしなくても閲覧できます。'
    ),
    breadcrumb: t(locale, '展覽 / 詳情', 'Exhibitions / Detail', '展覧会 / 詳細'),
    browseOthers: t(
      locale,
      '瀏覽其他展覽',
      'Browse other exhibitions',
      'ほかの展覧会を見る'
    ),
    loadError: t(
      locale,
      '目前無法載入展覽',
      'Exhibitions could not be loaded',
      '展覧会を読み込めません'
    ),
    loadErrorHint: t(
      locale,
      '請稍後再試，或改從 LINE 問機器人。',
      'Try again shortly, or ask the LINE bot.',
      'しばらくしてから再試行するか、LINE で聞いてください。'
    ),
    notFound: t(
      locale,
      '查無此展覽',
      'Exhibition not found',
      '展覧会が見つかりません'
    ),
    notFoundHint: t(
      locale,
      '連結可能已過期。回到目錄再找一次。',
      'This link may be out of date. Go back to the catalog.',
      'リンクが古い可能性があります。一覧に戻ってください。'
    ),
    pageNotFound: t(locale, '找不到這個頁面', 'Page not found', 'ページが見つかりません'),
    pageNotFoundHint: t(
      locale,
      '這個網址不存在，或已經從公開站拿掉。',
      'This address does not exist, or it was removed from the public site.',
      'この URL は存在しないか、公開サイトから削除されています。'
    ),
    retry: t(locale, '重試', 'Retry', '再試行'),
    emptyCatalog: t(
      locale,
      '目前沒有可顯示的展覽',
      'No exhibitions to show',
      '表示できる展覧会がありません'
    ),
    emptyCatalogHint: t(
      locale,
      '稍後再回來，或在 LINE 問最近的檔期。',
      'Check back later, or ask on LINE for current dates.',
      'あとでもう一度確認するか、LINE で会期を聞いてください。'
    ),
    demoBannerTitle: t(
      locale,
      '標示示範',
      'Labelled demo',
      'デモ（表記あり）'
    ),
    demoBannerBody: t(
      locale,
      '目錄含樣本列與開放資料摘要。入場與開放時間以官方頁面為準。',
      'The catalog includes sample rows and open-data summaries. Confirm hours and admission on the official page.',
      'カタログにはサンプル行とオープンデータの要約があります。開館と料金は公式ページで確認してください。'
    ),
    checkoutBannerTitle: t(locale, '售票已下線', 'Ticketing closed', 'チケット販売は終了'),
    checkoutBannerBody: t(
      locale,
      '這個站改為展覽發現，不再處理購票或訂單。',
      'This site is now exhibition discovery. It no longer handles tickets or orders.',
      'このサイトは展覧会発見に切り替わり、チケットや注文は扱いません。'
    ),
    checkoutTitle: t(locale, '售票已下線', 'Ticketing closed', 'チケット販売は終了しました'),
    checkoutLead: t(
      locale,
      '請回到展覽目錄，或到官方來源確認入場方式。',
      'Return to the catalog, or confirm admission on the official source.',
      '展覧会一覧に戻るか、公式情報で入場方法を確認してください。'
    ),
    retiredOrdersTitle: t(locale, '訂單已下線', 'Orders closed', '注文は終了しました'),
    retiredOrdersLead: t(
      locale,
      '公開站不再顯示購票訂單。改從目錄或 LINE 找展覽。',
      'The public site no longer shows ticket orders. Use the catalog or LINE instead.',
      '公開サイトではチケット注文を表示しません。一覧か LINE で探してください。'
    ),
    plinthLot: t(
      locale,
      '在 Plinth 看拍品（結算在 Plinth）',
      'View the lot on Plinth (settlement happens on Plinth)',
      'Plinth で作品を見る（決済は Plinth）'
    ),
    free: t(locale, '免費', 'Free', '無料'),
    priceFrom: (amount: string) =>
      t(locale, `NT$ ${amount} 起`, `From NT$ ${amount}`, `${amount}〜`),
    homeBadge: t(
      locale,
      '台北 · 東京',
      'Taipei · Tokyo',
      '台北 · 東京'
    ),
    homeTitle: t(
      locale,
      '台北與東京的展覽',
      'Exhibitions in Taipei and Tokyo',
      '台北と東京の展覧会'
    ),
    homeLead: t(
      locale,
      '從台北與東京的目錄裡，用城市、會期或關鍵字找展覽。打開詳情後，到官方頁面確認，或在 LINE 問機器人。',
      'Find exhibitions in Taipei and Tokyo by city, dates, and keyword. Open a listing, then confirm on the official page or ask the LINE bot.',
      '台北と東京の展覧会を、都市・会期・キーワードで探します。詳細を開き、公式ページか LINE で確認してください。'
    ),
    browse: t(locale, '瀏覽展覽', 'Browse exhibitions', '展覧会を見る'),
    howTitle: t(locale, '怎麼用', 'How it works', '使い方'),
    howLead: t(
      locale,
      '發現、打開詳情、再到官方或 LINE。這個站不售票。',
      'Find a listing, open the detail, then go to the official source or LINE. This site does not sell tickets.',
      '探して、詳細を開き、公式か LINE へ。このサイトではチケットを販売しません。'
    ),
    step1Title: t(locale, '搜尋展覽', 'Search exhibitions', '展覧会を探す'),
    step1Body: t(
      locale,
      '用城市、會期或關鍵字縮小範圍。',
      'Narrow by city, dates, or keyword.',
      '都市・会期・キーワードで絞り込みます。'
    ),
    step2Title: t(locale, '打開詳情', 'Open a listing', '詳細を開く'),
    step2Body: t(
      locale,
      '看會期、場地與目錄上的入場說明。',
      'Read dates, venue, and the admission note on the listing.',
      '会期・会場・掲載されている料金を確認します。'
    ),
    step3Title: t(locale, '到官方或 LINE', 'Official source or LINE', '公式または LINE'),
    step3Body: t(
      locale,
      '官方頁面有最新開放資訊。也可以加好友，用對話搜尋。',
      'The official page has the latest hours. Or add the official account and search in chat.',
      '最新の開館情報は公式ページにあります。公式アカウントを追加して会話でも検索できます。'
    ),
    seeEvents: t(locale, '查看展覽', 'See exhibitions', '展覧会を見る'),
    skipToContent: t(locale, '跳到主要內容', 'Skip to content', '本文へスキップ'),
    mainNav: t(locale, '主要選單', 'Main', 'メイン'),
    langZh: '中文',
    langEn: 'EN',
    langJa: '日本語',
    language: t(locale, '語言', 'Language', '言語'),
    searchEvents: t(locale, '搜尋展覽', 'Search exhibitions', '展覧会を検索'),
    searchEventsPlaceholder: t(
      locale,
      '搜尋名稱、場地或主辦',
      'Search by title, venue, or organizer',
      'タイトル・会場・主催で検索'
    ),
    searchHint: t(
      locale,
      '輸入時會更新結果。',
      'Results update as you type.',
      '入力すると結果が更新されます。'
    ),
    searchKeyboardHint: t(
      locale,
      'Enter 立即搜尋，Esc 清除。',
      'Press Enter to search now, Escape to clear.',
      'Enter で検索、Esc でクリア。'
    ),
    searching: t(locale, '搜尋中…', 'Searching…', '検索中…'),
    searchSlow: t(
      locale,
      '搜尋時間較長，仍在載入。',
      'This is taking longer than usual.',
      '検索に時間がかかっています。'
    ),
    searchErrorRateLimit: t(
      locale,
      '搜尋次數太多，請稍候再試。',
      'Too many searches. Try again in a moment.',
      '検索が多すぎます。しばらくしてから再試行してください。'
    ),
    searchErrorTooLong: t(
      locale,
      '關鍵字太長。請縮短後再搜尋。',
      'That search is too long. Shorten it and try again.',
      'キーワードが長すぎます。短くして再試行してください。'
    ),
    searchErrorNetwork: t(
      locale,
      '目前無法搜尋。請檢查網路後重試。',
      'Search could not run. Check your connection and retry.',
      '検索できません。接続を確認して再試行してください。'
    ),
    searchErrorGeneric: t(
      locale,
      '目前無法搜尋。請稍後再試。',
      'Search could not run. Try again shortly.',
      '検索できません。しばらくしてから再試行してください。'
    ),
    clearSearch: t(locale, '清除搜尋', 'Clear search', '検索をクリア'),
    resultsLabel: t(locale, '展覽列表', 'Exhibition results', '展覧会の結果'),
    queryLimit: (used: number, max: number) =>
      t(locale, `${used}／${max}`, `${used}/${max}`, `${used}/${max}`),
    filterStatus: t(locale, '會期', 'Dates', '会期'),
    filterCity: t(locale, '城市', 'City', '都市'),
    filterCategory: t(locale, '類型', 'Category', 'ジャンル'),
    allEvents: t(locale, '全部', 'All', 'すべて'),
    allCities: t(locale, '全部城市', 'All cities', 'すべての都市'),
    allCategories: t(locale, '全部類型', 'All categories', 'すべてのジャンル'),
    nowShowing: t(locale, '展出中', 'Now showing', '開催中'),
    thisMonth: t(locale, '本月', 'This month', '今月'),
    pastEvents: t(locale, '已結束', 'Ended', '終了'),
    viewDetails: t(locale, '查看詳情', 'View details', '詳細を見る'),
    emptySearch: t(
      locale,
      '沒有符合的展覽',
      'No exhibitions match this search',
      '該当する展覧会がありません'
    ),
    emptySearchHint: t(
      locale,
      '試試其他關鍵字，或清除篩選。',
      'Try another keyword, or clear filters.',
      '別のキーワードを試すか、絞り込みを解除してください。'
    ),
    emptyCity: (city: 'TAIPEI' | 'TOKYO') =>
      t(
        locale,
        city === 'TOKYO' ? '目前沒有東京的展覽' : '目前沒有台北的展覽',
        city === 'TOKYO'
          ? 'No exhibitions listed in Tokyo'
          : 'No exhibitions listed in Taipei',
        city === 'TOKYO'
          ? '東京の展覧会はまだありません'
          : '台北の展覧会はまだありません'
      ),
    emptyCityHint: t(
      locale,
      '改看全部城市，或在 LINE 問近期檔期。',
      'See all cities, or ask on LINE for current dates.',
      'すべての都市を見るか、LINE で会期を聞いてください。'
    ),
    emptyEnded: t(
      locale,
      '沒有已結束的展覽',
      'No ended exhibitions',
      '終了した展覧会はありません'
    ),
    emptyEndedHint: t(
      locale,
      '改看展出中或即將開始，或到 LINE 問近期檔期。',
      'Switch to now showing or upcoming, or ask on LINE.',
      '開催中や開催予定に切り替えるか、LINE で聞いてください。'
    ),
    endedNotice: t(
      locale,
      '這檔展覽已結束',
      'This exhibition has ended',
      'この展覧会は終了しました'
    ),
    endedNoticeHint: t(
      locale,
      '官方頁面仍可能有回顧或下一檔資訊。入場與開放時間以官方為準。',
      'The official page may still have recap or next-show notes. Confirm hours there.',
      '公式ページに振り返りや次回情報がある場合があります。開館は公式で確認してください。'
    ),
    lineLoginCancelled: t(
      locale,
      '已取消 LINE 登入',
      'LINE sign-in was cancelled',
      'LINE ログインをキャンセルしました'
    ),
    lineLoginCancelledHint: t(
      locale,
      '可以繼續逛目錄，或再試一次登入。',
      'Keep browsing the catalog, or try signing in again.',
      'カタログを続けるか、もう一度ログインしてください。'
    ),
    lineOutside: t(
      locale,
      '請在 LINE 裡打開這個頁面',
      'Open this page in LINE',
      'このページは LINE で開いてください'
    ),
    lineOutsideHint: t(
      locale,
      '對話搜尋要在 LINE 裡用。瀏覽器可以繼續看目錄，或先加入官方帳號。',
      'Chat search works inside LINE. You can keep browsing here, or add the official account.',
      '会話検索は LINE 内で使います。ブラウザではカタログを続けるか、公式アカウントを追加してください。'
    ),
    dismissNotice: t(locale, '關閉', 'Dismiss', '閉じる'),
    retryLogin: t(
      locale,
      '再試一次登入',
      'Try signing in again',
      'もう一度ログイン'
    ),
    shareListing: t(locale, '分享這個展覽', 'Share this listing', 'この展覧会をシェア'),
    copyLink: t(locale, '複製連結', 'Copy link', 'リンクをコピー'),
    linkCopied: t(locale, '已複製連結', 'Link copied', 'リンクをコピーしました'),
    shareFailed: t(
      locale,
      '無法分享，請稍後再試。',
      'Could not share. Try again shortly.',
      'シェアできませんでした。しばらくしてから再試行してください。'
    ),
    loadingLabel: t(locale, '載入中', 'Loading', '読み込み中'),
    appError: t(locale, '頁面出了問題', 'This page hit a problem', 'ページで問題が起きました'),
    appErrorHint: t(
      locale,
      '重新整理試試。目錄和 LINE 還可以用。',
      'Reload the page. The catalog and LINE still work.',
      '再読み込みしてください。カタログと LINE は使えます。'
    ),
    reloadPage: t(locale, '重新整理', 'Reload', '再読み込み'),
    footerNote: t(
      locale,
      '這個站不售票。入場與開放時間以官方頁面為準。',
      'This site does not sell tickets. Confirm hours and admission on the official page.',
      'このサイトではチケットを販売しません。開館と料金は公式ページで確認してください。'
    ),
    featuredTaipei: t(locale, '台北展覽', 'Taipei', '台北'),
    featuredTokyo: t(locale, '東京展覽', 'Tokyo', '東京'),
    seeCity: (city: 'TAIPEI' | 'TOKYO') =>
      t(
        locale,
        city === 'TOKYO' ? '看東京展覽' : '看台北展覽',
        city === 'TOKYO' ? 'See Tokyo' : 'See Taipei',
        city === 'TOKYO' ? '東京の展覧会' : '台北の展覧会'
      ),
    clearFilters: t(locale, '清除篩選', 'Clear filters', '絞り込みを解除'),
    backToEvents: t(locale, '回到展覽目錄', 'Back to exhibitions', '展覧会一覧へ戻る'),
    sessions: t(locale, '會期', 'Schedule', '会期'),
    noSessions: t(locale, '尚無會期', 'No dates yet', '会期はまだありません'),
    noSessionsHint: t(
      locale,
      '請到官方頁面確認，或稍後再看。',
      'Confirm on the official page, or check back later.',
      '公式ページで確認するか、あとでもう一度見てください。'
    ),
    lineLogin: t(locale, 'LINE 登入', 'Sign in with LINE', 'LINE でログイン'),
    linePreparing: t(locale, '準備中…', 'Preparing…', '準備中…'),
    lineLoginError: t(
      locale,
      'LINE 登入失敗，請再試一次。',
      'LINE sign-in failed. Please try again.',
      'LINE ログインに失敗しました。もう一度お試しください。'
    ),
    lineChat: t(locale, '在 LINE 問展覽', 'Ask on LINE', 'LINE で聞く'),
    lineAddFriend: t(locale, '加入官方帳號', 'Add official account', '公式アカウントを追加'),
    lineChatHint: t(
      locale,
      '加好友後，用城市或關鍵字問檔期。',
      'After adding the official account, ask by city or keyword.',
      '友だち追加後、都市やキーワードで会期を聞けます。'
    ),
    officialSource: t(locale, '官方頁面', 'Official page', '公式ページ'),
    officialSourceHint: t(
      locale,
      '在來源網站確認開放時間與入場。',
      'Confirm hours and admission on the source site.',
      '開館時間と入場は出典サイトで確認してください。'
    ),
    externalLink: t(locale, '另開視窗', 'Opens in a new tab', '新しいタブで開きます'),
    sampleBadge: t(locale, '樣本資料', 'Sample data', 'サンプルデータ'),
    sampleHint: t(
      locale,
      '這筆是目錄樣本，不是官方售票資訊。',
      'This is a catalog sample, not an official ticket listing.',
      'カタログ用のサンプルであり、公式の販売情報ではありません。'
    ),
    welcomeBack: (name: string) =>
      t(
        locale,
        `歡迎回來${name ? `，${name}` : ''}。繼續找台北或東京的展覽。`,
        `Welcome back${name ? `, ${name}` : ''}. Keep browsing Taipei and Tokyo.`,
        `おかえりなさい${name ? `、${name}` : ''}。台北と東京の展覧会を続けてください。`
      ),
    domain: {
      talk: t(locale, '講座', 'Talk', 'トーク'),
      auction: t(locale, '拍賣', 'Auction', 'オークション'),
      line_commerce: t(locale, 'LINE 商務', 'LINE commerce', 'LINE コマース'),
      exhibition: t(locale, '展覽', 'Exhibition', '展覧会'),
    },
    region: {
      TAIPEI: t(locale, '台北', 'Taipei', '台北'),
      TOKYO: t(locale, '東京', 'Tokyo', '東京'),
    },
    status: {
      upcoming: t(locale, '即將開始', 'Upcoming', '開催予定'),
      ongoing: t(locale, '展出中', 'Now showing', '開催中'),
      completed: t(locale, '已結束', 'Ended', '終了'),
      sale_ended: t(locale, '已結束', 'Ended', '終了'),
      cancelled: t(locale, '已下架', 'Unavailable', '非公開'),
    },
    cash: t(locale, '現場付款', 'Pay at the door', '現地払い'),
    cashHint: t(
      locale,
      '公開站已不再處理付款。',
      'The public site no longer handles payment.',
      '公開サイトでは支払いを扱いません。'
    ),
    atm: t(locale, 'ATM 轉帳（已下線）', 'ATM transfer (closed)', 'ATM 振込（終了）'),
    atmHint: t(
      locale,
      '公開站已不再處理轉帳。',
      'The public site no longer handles transfers.',
      '公開サイトでは振込を扱いません。'
    ),
    thirdParty: t(locale, '金流（已下線）', 'Payments (closed)', '決済（終了）'),
    thirdPartyHint: t(
      locale,
      '公開站已不再開啟結帳。',
      'The public site no longer opens checkout.',
      '公開サイトでは決済画面を開きません。'
    ),
    metaTitle: t(
      locale,
      'NX Playground — 台北與東京的展覽',
      'NX Playground — exhibitions in Taipei and Tokyo',
      'NX Playground — 台北と東京の展覧会'
    ),
    metaDescription: t(
      locale,
      '搜尋台北與東京的展覽，打開詳情後到官方頁面或 LINE 確認。目錄含樣本列與開放資料摘要。',
      'Search exhibitions in Taipei and Tokyo, then confirm on the official page or LINE. The catalog includes sample rows and open-data summaries.',
      '台北と東京の展覧会を探し、公式ページか LINE で確認します。カタログにはサンプル行とオープンデータの要約があります。'
    ),
  };
}

export function priceFromLabel(price: number, locale: string | undefined): string {
  const copy = demoCopy(locale);
  return price > 0 ? copy.priceFrom(price.toLocaleString('zh-TW')) : copy.free;
}

export function catalogPriceLabel(
  event: { price: number; priceText?: string },
  locale: string | undefined
): string {
  const text = event.priceText?.trim();
  if (text) return text;
  return priceFromLabel(event.price, locale);
}
