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
    siteName: 'NX Playground Events',
    navEvents: t(locale, '活動', 'Events', '展覧会'),
    navOrders: t(locale, '訂單', 'Orders'),
    logout: t(locale, '登出', 'Log out', 'ログアウト'),
    upcoming: t(locale, '即將舉辦', 'Upcoming', '開催予定'),
    upcomingLead: t(
      locale,
      '查看場次與票價後報名。無需登入，示範身分即可完成。',
      'Browse sessions and prices, then register as the labelled demo guest. No login required.',
      '台北と東京の展覧会を探すサンプルカタログです。'
    ),
    eventCount: (n: number) =>
      t(locale, `${n} 場活動`, `${n} events`, `${n} 件の展覧会`),
    viewSessions: t(locale, '查看場次', 'View sessions', '詳細を見る'),
    speakers: t(locale, '講者', 'Speakers', '関連'),
    speakerCount: (n: number) =>
      t(locale, `${n} 位講者`, `${n} speakers`, `${n} 件`),
    venue: t(locale, '場地', 'Venue', '会場'),
    when: t(locale, '時間', 'When', '会期'),
    price: t(locale, '票價', 'Price', '料金'),
    organizer: t(locale, '主辦', 'Organizer', '主催'),
    seatsLeft: t(locale, '剩餘名額', 'Seats left'),
    location: t(locale, '地點', 'Location', '場所'),
    faq: t(locale, '常見問題', 'FAQ', 'よくある質問'),
    openOsm: t(
      locale,
      '在 OpenStreetMap 開啟',
      'Open in OpenStreetMap',
      'OpenStreetMap で開く'
    ),
    mapTitle: t(locale, '場地地圖', 'Venue map', '会場マップ'),
    guestSignup: t(
      locale,
      '示範身分即可報名，無需登入。',
      'Register as the labelled demo guest. No login required.'
    ),
    breadcrumb: t(locale, '活動 / 詳情', 'Events / Detail', '展覧会 / 詳細'),
    browseOthers: t(
      locale,
      '瀏覽其他活動',
      'Browse other events',
      'ほかの展覧会を見る'
    ),
    loadError: t(
      locale,
      '目前無法載入活動',
      'Events could not be loaded',
      '展覧会を読み込めません'
    ),
    loadErrorHint: t(
      locale,
      '請稍後再試。',
      'Please try again shortly.',
      'しばらくしてから再試行してください。'
    ),
    notFound: t(locale, '查無此活動', 'Event not found', '展覧会が見つかりません'),
    notFoundHint: t(
      locale,
      '請確認網址是否正確',
      'Check the URL or go back to the list.',
      'URL を確認するか、一覧に戻ってください。'
    ),
    retry: t(locale, '重試', 'Retry', '再試行'),
    emptyCatalog: t(
      locale,
      '目前沒有可報名的活動',
      'No events are open for signup',
      '表示できる展覧会がありません'
    ),
    emptyCatalogHint: t(
      locale,
      '稍後再回來，或向主辦確認是否已發布。重新整理頁面可再試一次。',
      'Check back later, or ask the organizer whether the event is published.',
      'あとでもう一度確認してください。'
    ),
    vendorEmpty: t(locale, '暫無活動', 'No events yet', '展覧会はまだありません'),
    vendorEmptyHint: t(
      locale,
      '此主辦方目前沒有舉辦任何活動',
      'This organizer has no published events.',
      'この主催者の公開中の展覧会はありません。'
    ),
    demoBannerTitle: t(
      locale,
      '標示示範（Hobby）',
      'Labelled Hobby demo',
      'Hobby デモ（表記あり）'
    ),
    demoBannerBody: t(
      locale,
      '目錄與模擬結帳使用記憶體 fixtures。這不是 Nest 資金 API，也不會扣款。',
      'Catalog and mock checkout use in-memory fixtures. This is not the Nest funds API and does not charge a card.',
      'カタログはメモリ上のサンプルデータです。Nest の決済 API ではなく、課金もしません。'
    ),
    checkoutBannerTitle: t(locale, '示範結帳', 'Demo checkout'),
    checkoutBannerBody: t(
      locale,
      '付款與金流為 mock，不會扣款；完成後可在訂單頁查看狀態與後續步驟。',
      'Payment is mock and will not charge a card. Afterward you can follow status and next steps on the order page.'
    ),
    checkoutTitle: t(locale, '選擇票券', 'Choose tickets'),
    checkoutLead: t(
      locale,
      '請選擇場次、票種與付款方式',
      'Pick a session, ticket type, and payment method'
    ),
    plinthLot: t(
      locale,
      '在 Plinth 看拍品（結算在 Plinth）',
      'View the lot on Plinth (settlement happens on Plinth)'
    ),
    free: t(locale, '免費', 'Free', '無料'),
    priceFrom: (amount: string) =>
      t(locale, `NT$ ${amount} 起`, `From NT$ ${amount}`, `${amount}〜`),
    homeBadge: t(
      locale,
      '活動發現與報名 · 標示示範',
      'Events · labelled demo',
      '展覧会を探す · デモ'
    ),
    homeLead: t(
      locale,
      '發現活動，用示範身分 user_demo 報名。此 Hobby 示範尚未接 LINE Login（STOP-013）。',
      'Find events and register as guest user_demo. LINE login is not wired on this Hobby demo (STOP-013).',
      '台北と東京の展覧会を探すサンプルです。ゲスト user_demo で閲覧できます。この Hobby デモでは LINE Login 未接続です（STOP-013）。'
    ),
    browse: t(locale, '瀏覽活動', 'Browse events', '展覧会を見る'),
    myOrders: t(locale, '我的訂單', 'My orders'),
    howTitle: t(locale, '怎麼參加', 'How it works', '使い方'),
    howLead: t(
      locale,
      '從發現活動到模擬票券。公開站不收真錢。',
      'From finding an event to a mock ticket — no live payment.',
      '展覧会を見つけて詳細を開きます。公開デモでは課金しません。'
    ),
    step1Title: t(locale, '瀏覽活動', 'Browse events', '展覧会を探す'),
    step1Body: t(
      locale,
      '查看場次、票種、講者與票價起。',
      'Check sessions, ticket types, speakers, and price-from.',
      '会期・会場・料金の目安を確認します。'
    ),
    step2Title: t(locale, '示範身分報名', 'Guest signup'),
    step2Body: t(
      locale,
      '結帳使用標示示範身分 user_demo。不必登入 LINE。',
      'Checkout uses labelled demo identity user_demo. LINE is optional and not required.'
    ),
    step3Title: t(locale, '模擬票券', 'Mock ticket'),
    step3Body: t(
      locale,
      '訂單留在 Hobby 記憶體，冷啟動會清空。不是資金路徑。',
      'Orders stay in Hobby memory and reset on a cold start. Not the funds path.'
    ),
    seeEvents: t(locale, '查看活動', 'See events', '展覧会を見る'),
    skipToContent: t(locale, '跳到主要內容', 'Skip to content', '本文へスキップ'),
    mainNav: t(locale, '主要選單', 'Main', 'メイン'),
    langZh: '中文',
    langEn: 'EN',
    langJa: '日本語',
    language: t(locale, '語言', 'Language', '言語'),
    searchEvents: t(locale, '搜尋活動', 'Search events', '展覧会を検索'),
    searchEventsPlaceholder: t(
      locale,
      '搜尋活動名稱、地點或主辦',
      'Search by title, venue, or organizer',
      'タイトル・会場・主催で検索'
    ),
    filterStatus: t(locale, '篩選', 'Filter', '絞り込み'),
    allEvents: t(locale, '全部', 'All', 'すべて'),
    pastEvents: t(locale, '過往', 'Past', '終了'),
    viewDetails: t(locale, '查看詳情', 'View details', '詳細を見る'),
    emptySearch: t(
      locale,
      '沒有符合的活動',
      'No events match this search',
      '該当する展覧会がありません'
    ),
    emptySearchHint: t(
      locale,
      '試試其他關鍵字，或清除篩選。',
      'Try another keyword, or clear filters.',
      '別のキーワードを試すか、絞り込みを解除してください。'
    ),
    backToEvents: t(locale, '回到活動列表', 'Back to events', '展覧会一覧へ戻る'),
    sessions: t(locale, '場次', 'Sessions', '会期'),
    noSessions: t(locale, '尚無場次', 'No sessions yet', '会期はまだありません'),
    noSessionsHint: t(
      locale,
      '請稍後再試，或聯絡主辦。',
      'Try again later, or contact the organizer.',
      'しばらくしてから再試行するか、主催者に問い合わせてください。'
    ),
    lineLogin: t(locale, 'LINE 登入', 'Sign in with LINE', 'LINE でログイン'),
    linePreparing: t(locale, '準備中…', 'Preparing…', '準備中…'),
    lineLoginError: t(
      locale,
      'LINE 登入失敗，請再試一次。',
      'LINE sign-in failed. Please try again.',
      'LINE ログインに失敗しました。もう一度お試しください。'
    ),
    welcomeBack: (name: string) =>
      t(
        locale,
        `歡迎回來${name ? `，${name}` : ''}。繼續瀏覽活動，或查看您的訂單與票券。`,
        `Welcome back${name ? `, ${name}` : ''}. Browse events or open your tickets.`,
        `おかえりなさい${name ? `、${name}` : ''}。展覧会を続けるか、詳細を開いてください。`
      ),
    domain: {
      talk: t(locale, '講座', 'Talk', '展覧会'),
      auction: t(locale, '拍賣', 'Auction'),
      line_commerce: t(locale, 'LINE 商務', 'LINE commerce'),
    },
    status: {
      upcoming: t(locale, '報名中', 'Open', '開催予定'),
      ongoing: t(locale, '進行中', 'Ongoing', '開催中'),
      completed: t(locale, '已舉辦', 'Past', '終了'),
      sale_ended: t(locale, '停售', 'Sales ended'),
      cancelled: t(locale, '已下架', 'Cancelled', '中止'),
    },
    cash: t(locale, '現場付款', 'Pay at the door'),
    cashHint: t(
      locale,
      '示範會產生 QR。此 Hobby 站不會真的收款。',
      'Creates a demo QR. No real cash is collected on this Hobby site.'
    ),
    atm: t(locale, 'ATM 轉帳（示範）', 'ATM transfer (demo)'),
    atmHint: t(
      locale,
      '只顯示示範帳號。請不要匯真錢。',
      'Shows a demo account. Do not send real money.'
    ),
    thirdParty: t(locale, '模擬金流', 'Mock PSP'),
    thirdPartyHint: t(
      locale,
      '開啟模擬金流頁。不是 live 綠界。',
      'Opens a mock checkout page. Not live ECPay.'
    ),
    metaTitle: t(
      locale,
      'NX Playground Events — 標示 Hobby 示範',
      'NX Playground Events — labelled Hobby demo',
      'NX Playground Events — 台北と東京の展覧会デモ'
    ),
    metaDescription: t(
      locale,
      '台灣活動棧 C 端標示示範。目錄與模擬票券使用記憶體 fixtures。不是 Nest 資金 API。',
      'Taiwan event-stack C-end labelled demo. Catalog and mock tickets use in-memory fixtures. Not the Nest funds API.',
      '台北と東京の展覧会発見デモ。カタログはサンプルデータです。Nest の決済 API ではありません。'
    ),
  };
}

export function priceFromLabel(price: number, locale: string | undefined): string {
  const copy = demoCopy(locale);
  return price > 0 ? copy.priceFrom(price.toLocaleString('zh-TW')) : copy.free;
}
