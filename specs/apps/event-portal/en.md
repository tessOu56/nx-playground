---
id: event-portal
version: 0.0.1
lastUpdated: '2025-10-24'
category: nextjs
status: development
published: true

shortDesc: |
  Event browsing and registration platform with LINE LIFF integration and QR code ticketing.
  Built with Next.js 15 App Router for optimal performance.

purpose: |
  Public-facing event platform demonstrating Next.js SSG/SSR,
  third-party integration (LINE LIFF), and user-facing product development.

highlights:
  - Next.js 15 App Router with React 19
  - Static Site Generation (SSG) for performance
  - LINE LIFF SDK integration
  - QR code ticket generation
  - Multi-language with next-intl
  - Responsive event browsing

useCases:
  - Event discovery and browsing
  - Online event registration
  - QR code ticketing system
  - LINE integration demonstration

targetAudience: |
  Demonstrates Next.js expertise, third-party API integration,
  and user-facing product development skills.

reviewer: tessou
reviewedAt: '2025-10-24'
nextReview: '2025-11-24'
updateFrequency: per-feature
draftStatus: false
approvalStatus: approved

lastSync: '2025-10-24'
---

# Event Portal - Public Event Platform

Next.js-based event browsing and registration platform with LINE LIFF integration.

## Technical Stack
- Next.js 15 (App Router)
- React 19
- LINE LIFF SDK
- next-intl for i18n
- Tailwind CSS
- TypeScript

---

## Progress & Roadmap

### Current Status
- **Version**: 0.0.1
- **Completion**: 70%
- **Stage**: Development
- **Last Updated**: 2025-01-24

### Completed Features
- ✅ Next.js 15 App Router setup
- ✅ Event browsing UI (list & detail pages)
- ✅ LINE LIFF SDK configuration
- ✅ Multi-language support (next-intl)
- ✅ Responsive design
- ✅ Event card components
- ✅ Static site generation (SSG)

### In Progress
- 🚧 API integration with event API server
- 🚧 Registration flow implementation
- 🚧 LINE LIFF authentication testing

### Next Steps (Roadmap)

**P0 - Critical** (2-3 weeks):
- [ ] Complete API integration with api-server
- [ ] Implement event registration flow
- [ ] LINE LIFF full authentication integration
- [ ] QR code ticket generation system

**P1 - High** (1 month):
- [ ] Payment flow (Stripe/TapPay integration)
- [ ] User dashboard (my events, tickets)
- [ ] Email notifications
- [ ] Testing (E2E with Playwright)

**P2 - Medium**:
- [ ] Event search & filtering
- [ ] Event recommendations
- [ ] Social sharing
- [ ] Analytics integration

### Technical Debt
- API client needs full integration
- Authentication flow not complete
- Test coverage: 0% (target 60%+)
- Production deployment pending

### Dependencies
- Requires: `api-server` with event endpoints
- Requires: LINE LIFF testing account
- Requires: Payment gateway setup

### Changelog
Version history will be tracked once production release begins
