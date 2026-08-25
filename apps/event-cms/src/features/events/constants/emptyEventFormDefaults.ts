import { type EventFormValue } from '../types';

/** Empty create defaults — no demo session/ticket names (T-278). */
export const emptyEventFormDefaults: EventFormValue = {
  eventCoverImage: null,
  eventName: '',
  eventDescription: '',
  eventLocation: '',
  organizerName: '',
  speakersText: '',
  venueLat: '',
  venueLng: '',
  eventKind: 'talk',
  plinthLotUrl: '',
  eventContentBlocks: [],
  faqBlocks: [],
  sessionBlock: [],
  ticketBlock: [],
  bankTransfer: {
    id: '',
    enable: false,
    type: 'ATM',
    bankName: '',
    branchName: '',
    accountName: '',
    account: '',
    description: '',
  },
  cashpayment: {
    id: '',
    enable: false,
    type: 'cash',
    description: undefined,
  },
  visibility: 'public',
};
