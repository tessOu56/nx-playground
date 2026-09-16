export type DemoLocale = 'zh-TW' | 'en';

export function isEnLocale(locale: string | undefined): boolean {
  return locale === 'en';
}

export function demoCopy(locale: string | undefined) {
  const en = isEnLocale(locale);
  return {
    siteName: 'NX Playground Events',
    navEvents: en ? 'Events' : '活動',
    navOrders: en ? 'Orders' : '訂單',
    logout: en ? 'Log out' : '登出',
    upcoming: en ? 'Upcoming' : '即將舉辦',
    upcomingLead: en
      ? 'Browse sessions and prices, then register as the labelled demo guest. No login required.'
      : '查看場次與票價後報名。無需登入，示範身分即可完成。',
    eventCount: (n: number) => (en ? `${n} events` : `${n} 場活動`),
    viewSessions: en ? 'View sessions' : '查看場次',
    speakers: en ? 'Speakers' : '講者',
    speakerCount: (n: number) => (en ? `${n} speakers` : `${n} 位講者`),
    venue: en ? 'Venue' : '場地',
    when: en ? 'When' : '時間',
    price: en ? 'Price' : '票價',
    organizer: en ? 'Organizer' : '主辦',
    seatsLeft: en ? 'Seats left' : '剩餘名額',
    location: en ? 'Location' : '地點',
    faq: en ? 'FAQ' : '常見問題',
    openOsm: en ? 'Open in OpenStreetMap' : '在 OpenStreetMap 開啟',
    mapTitle: en ? 'Venue map' : '場地地圖',
    guestSignup: en
      ? 'Register as the labelled demo guest. No login required.'
      : '示範身分即可報名，無需登入。',
    breadcrumb: en ? 'Events / Detail' : '活動 / 詳情',
    browseOthers: en ? 'Browse other events' : '瀏覽其他活動',
    loadError: en ? 'Events could not be loaded' : '目前無法載入活動',
    loadErrorHint: en ? 'Please try again shortly.' : '請稍後再試。',
    notFound: en ? 'Event not found' : '查無此活動',
    notFoundHint: en
      ? 'Check the URL or go back to the list.'
      : '請確認網址是否正確',
    retry: en ? 'Retry' : '重試',
    emptyCatalog: en ? 'No events are open for signup' : '目前沒有可報名的活動',
    emptyCatalogHint: en
      ? 'Check back later, or ask the organizer whether the event is published.'
      : '稍後再回來，或向主辦確認是否已發布。重新整理頁面可再試一次。',
    vendorEmpty: en ? 'No events yet' : '暫無活動',
    vendorEmptyHint: en
      ? 'This organizer has no published events.'
      : '此主辦方目前沒有舉辦任何活動',
    demoBannerTitle: en ? 'Labelled Hobby demo' : '標示示範（Hobby）',
    demoBannerBody: en
      ? 'Catalog and mock checkout use in-memory fixtures. This is not the Nest funds API and does not charge a card.'
      : '目錄與模擬結帳使用記憶體 fixtures。這不是 Nest 資金 API，也不會扣款。',
    checkoutBannerTitle: en ? 'Demo checkout' : '示範結帳',
    checkoutBannerBody: en
      ? 'Payment is mock and will not charge a card. Afterward you can follow status and next steps on the order page.'
      : '付款與金流為 mock，不會扣款；完成後可在訂單頁查看狀態與後續步驟。',
    checkoutTitle: en ? 'Choose tickets' : '選擇票券',
    checkoutLead: en
      ? 'Pick a session, ticket type, and payment method'
      : '請選擇場次、票種與付款方式',
    plinthLot: en
      ? 'View the lot on Plinth (settlement happens on Plinth)'
      : '在 Plinth 看拍品（結算在 Plinth）',
    free: en ? 'Free' : '免費',
    priceFrom: (amount: string) =>
      en ? `From NT$ ${amount}` : `NT$ ${amount} 起`,
    homeBadge: en ? 'Events · labelled demo' : '活動發現與報名 · 標示示範',
    homeLead: en
      ? 'Find events and register as guest user_demo. LINE login is not wired on this Hobby demo (STOP-013).'
      : '發現活動，用示範身分 user_demo 報名。此 Hobby 示範尚未接 LINE Login（STOP-013）。',
    browse: en ? 'Browse events' : '瀏覽活動',
    myOrders: en ? 'My orders' : '我的訂單',
    howTitle: en ? 'How it works' : '怎麼參加',
    howLead: en
      ? 'From finding an event to a mock ticket — no live payment.'
      : '從發現活動到模擬票券。公開站不收真錢。',
    step1Title: en ? 'Browse events' : '瀏覽活動',
    step1Body: en
      ? 'Check sessions, ticket types, speakers, and price-from.'
      : '查看場次、票種、講者與票價起。',
    step2Title: en ? 'Guest signup' : '示範身分報名',
    step2Body: en
      ? 'Checkout uses labelled demo identity user_demo. LINE is optional and not required.'
      : '結帳使用標示示範身分 user_demo。不必登入 LINE。',
    step3Title: en ? 'Mock ticket' : '模擬票券',
    step3Body: en
      ? 'Orders stay in Hobby memory and reset on a cold start. Not the funds path.'
      : '訂單留在 Hobby 記憶體，冷啟動會清空。不是資金路徑。',
    seeEvents: en ? 'See events' : '查看活動',
    welcomeBack: (name: string) =>
      en
        ? `Welcome back${name ? `, ${name}` : ''}. Browse events or open your tickets.`
        : `歡迎回來${name ? `，${name}` : ''}。繼續瀏覽活動，或查看您的訂單與票券。`,
    domain: {
      talk: en ? 'Talk' : '講座',
      auction: en ? 'Auction' : '拍賣',
      line_commerce: en ? 'LINE commerce' : 'LINE 商務',
    },
    status: {
      upcoming: en ? 'Open' : '報名中',
      ongoing: en ? 'Ongoing' : '進行中',
      completed: en ? 'Past' : '已舉辦',
      sale_ended: en ? 'Sales ended' : '停售',
      cancelled: en ? 'Cancelled' : '已下架',
    },
    cash: en ? 'Pay at the door' : '現場付款',
    cashHint: en
      ? 'Creates a demo QR. No real cash is collected on this Hobby site.'
      : '示範會產生 QR。此 Hobby 站不會真的收款。',
    atm: en ? 'ATM transfer (demo)' : 'ATM 轉帳（示範）',
    atmHint: en
      ? 'Shows a demo account. Do not send real money.'
      : '只顯示示範帳號。請不要匯真錢。',
    thirdParty: en ? 'Mock PSP' : '模擬金流',
    thirdPartyHint: en
      ? 'Opens a mock checkout page. Not live ECPay.'
      : '開啟模擬金流頁。不是 live 綠界。',
    metaTitle: en
      ? 'NX Playground Events — labelled Hobby demo'
      : 'NX Playground Events — 標示 Hobby 示範',
    metaDescription: en
      ? 'Taiwan event-stack C-end labelled demo. Catalog and mock tickets use in-memory fixtures. Not the Nest funds API.'
      : '台灣活動棧 C 端標示示範。目錄與模擬票券使用記憶體 fixtures。不是 Nest 資金 API。',
  };
}

export function priceFromLabel(price: number, locale: string | undefined): string {
  const copy = demoCopy(locale);
  return price > 0 ? copy.priceFrom(price.toLocaleString('zh-TW')) : copy.free;
}
