import { getPageNumbersWithLocale, getPageInfoByPath } from '../mockRoutes';

describe('mockRoutes', () => {
  describe('getPageNumbersWithLocale', () => {
    it('should generate page numbers with zh-TW locale', () => {
      const { allPages } = getPageNumbersWithLocale('zh-TW');

      expect(allPages.P01.path).toBe('/zh-TW/');
      expect(allPages.P02.path).toBe('/zh-TW/vendors/vendor-1');
      expect(allPages.P03.path).toBe('/zh-TW/events/event-1');
    });

    it('should generate page numbers with en locale', () => {
      const { allPages } = getPageNumbersWithLocale('en');

      expect(allPages.P01.path).toBe('/en/');
      expect(allPages.P02.path).toBe('/en/vendors/vendor-1');
      expect(allPages.P03.path).toBe('/en/events/event-1');
    });

    it('should use default zh-TW locale when no locale provided', () => {
      const { allPages } = getPageNumbersWithLocale();

      expect(allPages.P01.path).toBe('/zh-TW/');
      expect(allPages.P02.path).toBe('/zh-TW/vendors/vendor-1');
    });

    it('should separate main flow and order status pages', () => {
      const { mainFlowPages, orderStatusPages } =
        getPageNumbersWithLocale('zh-TW');

      // 主要流程頁面應該是 P02-P08
      expect(
        mainFlowPages.every(page => {
          const pageNum = parseInt(page.number.replace('P', ''));
          return pageNum >= 2 && pageNum <= 8;
        })
      ).toBe(true);

      // 訂單狀態頁面應該是 P01 + P09+
      expect(
        orderStatusPages.every(page => {
          const pageNum = parseInt(page.number.replace('P', ''));
          return pageNum === 1 || pageNum >= 9;
        })
      ).toBe(true);
    });
  });

  describe('getPageInfoByPath', () => {
    it('should find page info with zh-TW locale', () => {
      const pageInfo = getPageInfoByPath('/zh-TW/events/event-1');

      expect(pageInfo).toBeTruthy();
      expect(pageInfo?.number).toBe('P03');
      expect(pageInfo?.title).toBe('活動詳情');
    });

    it('should find page info with en locale', () => {
      const pageInfo = getPageInfoByPath('/en/events/event-1');

      expect(pageInfo).toBeTruthy();
      expect(pageInfo?.number).toBe('P03');
      expect(pageInfo?.title).toBe('Event Details');
    });

    it('should find page info without locale (using default)', () => {
      const pageInfo = getPageInfoByPath('/events/event-1');

      expect(pageInfo).toBeTruthy();
      expect(pageInfo?.number).toBe('P03');
      expect(pageInfo?.title).toBe('活動詳情');
    });

    it('should find page info with explicit locale parameter', () => {
      const pageInfo = getPageInfoByPath('/events/event-1', 'en');

      expect(pageInfo).toBeTruthy();
      expect(pageInfo?.number).toBe('P03');
      expect(pageInfo?.title).toBe('Event Details');
    });

    it('should return null for non-existent path', () => {
      const pageInfo = getPageInfoByPath('/non-existent/path');

      expect(pageInfo).toBeNull();
    });
  });
});
