import { z } from 'zod';

export enum EditingBlockEnum {
  CoverImage = 0,
  Introduction = 1,
  EventContent = 2,
  FAQ = 3,
  Others = 4,
}

export enum NavigateEnum {
  event = 0,
  session = 1,
  ticket = 2,
  form = 3,
  preView = 4,
}

// ----------Content block----------
export const contentBlockSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image']),
  content: z.union([z.instanceof(File), z.string(), z.null()]),
});

// ----------FAQ block----------
export const faqBlockSchema = z.object({
  id: z.string(),
  question: z.string().min(1, '問題不能為空'),
  answer: z.string().min(1, '答案不能為空'),
});

// ----------Session Block----------
export const sessionBlockSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '請輸入場次名稱').max(50, '最多可輸入50個字元'),
  date: z.string().min(1, '請選擇場次日期'),
  startTime: z.string().min(1, '請選擇開始時間'),
  endTime: z.string().min(1, '請選擇結束時間'),
  capacityLimit: z
    .number()
    .min(1, '請輸入1-100000的數量')
    .max(100000, '請輸入1-100000的數量')
    .optional()
    .nullable(),
});
export type SessionBlockType = z.infer<typeof sessionBlockSchema>;

// ----------Ticket Block----------
export const ticketBlockSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '請輸入票券名稱').max(50, '最多可輸入50個字元'),
  price: z
    .number()
    .min(0, '請輸入0-3000000的票價')
    .max(3000000, '請輸入0-3000000的票價'),
  count: z
    .number()
    .min(1, '請輸入1-100000的數量')
    .max(100000, '請輸入1-100000的數量'),
  state: z.boolean(),
  saleTime: z
    .array(
      z.object({
        sessionId: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .min(1, '至少需要一個販售時間'),
  globalTime: z
    .object({
      commonStartTime: z.string(),
      commonEndTime: z.string(),
    })
    .optional(),
  saleTimeType: z.boolean(), //true = 統一 false = 分段
  offset: z.object({
    startOffset: z.number().min(0),
    startOffsetBase: z.number(),
    endOffset: z.number().min(0),
    endOffsetState: z.enum(['beforeStart', 'beforeEnd']).optional(),
    endOffsetBase: z.number(),
  }),
});
export type TicketBlockType = z.infer<typeof ticketBlockSchema>;

// ----------Form Block Schema----------
const fieldSchema = z.object({
  id: z.string(),
  fieldType: z.enum([
    'text',
    'email',
    'number',
    'tel',
    'url',
    'textarea',
    'radio',
    'checkbox',
    'select',
    'date',
    'description',
  ]),
  label: z
    .string()
    .min(1, '欄位標題為必填')
    .max(50, '欄位標題最多可輸入50個字元'),
  hint: z.string().max(100, '欄位提示最多可輸入100個字元'),
  description: z.string().max(200, '欄位說明最多可輸入200個字元'),
  isRequired: z.boolean(),
  noteContent: z.string().max(500, '已達500字上限'),
  options: z.array(z.string().max(50, '選項最多可輸入50個字元')).optional(),
});

export const formBlockSchema = z.object({
  id: z.string(),
  formName: z.string().min(1, '請輸入表單名稱'),
  fields: z.array(fieldSchema).superRefine((fields, ctx) => {
    // 檢查欄位標題是否重複
    const seenLabels = new Map<string, number[]>();
    fields.forEach((f, idx) => {
      const key = f.label.trim();
      if (!seenLabels.has(key)) {
        seenLabels.set(key, [idx]);
      } else {
        const arr = seenLabels.get(key);
        if (arr) {
          arr.push(idx);
        }
      }
    });
    seenLabels.forEach(indexes => {
      if (indexes.length > 1) {
        indexes.forEach(i => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '欄位標題已存在',
            path: [i, 'label'],
          });
        });
      }
    });

    // 檢查每個欄位內的 options 是否有重複
    fields.forEach((f, fieldIdx) => {
      if (f.options) {
        const seenOptions = new Map<string, number[]>();
        f.options.forEach((opt, optIdx) => {
          const key = opt.trim();
          if (!seenOptions.has(key)) {
            seenOptions.set(key, [optIdx]);
          } else {
            const arr = seenOptions.get(key);
            if (arr) {
              arr.push(optIdx);
            }
          }
        });

        seenOptions.forEach(indexes => {
          if (indexes.length > 1) {
            indexes.forEach(i => {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '選項名稱已存在',
                path: [fieldIdx, 'options', i], // 錯誤掛在對應的選項 input
              });
            });
          }
        });
      }
    });
  }),
});

export type EventFormFieldType = {
  id: string;
  fieldType:
    | 'text'
    | 'email'
    | 'number'
    | 'text'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'radio'
    | 'checkbox'
    | 'select'
    | 'date'
    | 'description';
  label: string;
  hint: string;
  description: string;
  isRequired: boolean;
  noteContent: string;
  options?: string[];
};

export type FormBlockType = z.infer<typeof formBlockSchema>;

// ----------Payment----------
const bankTransferSchema = z.object({
  id: z.string(),
  enable: z.boolean().default(false),
  type: z.string().default('ATM'),
  bankName: z.string().min(1, '請輸入銀行名稱'),
  branchName: z.string().min(1, '請輸入銀行名稱'),
  accountName: z.string().min(1, '請輸入戶名'),
  account: z
    .string()
    .min(7, '銀行帳號至少 7 碼')
    .max(14, '銀行帳號最多 14 碼')
    .regex(/^\d+$/, '銀行帳號只能輸入數字'),
  description: z.string().optional(),
});

const CashSchema = z.object({
  id: z.string(),
  enable: z.boolean().default(false),
  type: z.string().default('cash'),
  description: z.string().optional(),
});

export const EditPaymentSchema = z.object({
  id: z.string(),
  bankName: z.string().min(1, '銀行名稱必填'),
  branchName: z.string().min(1, '分行名稱必填'),
  accountName: z.string().min(1, '戶名必填'),
  account: z
    .number({ invalid_type_error: '帳號必須為數字' })
    .min(100000000, '帳號至少 9 碼'), // 最小 9 位數
  type: z.string(),
});

// 2️⃣ 自動生成 TypeScript type
export type EditPaymentForm = z.infer<typeof EditPaymentSchema>;

// ----------活動創建表單 schema----------
export const eventFormSchema = z.object({
  eventCoverImage: z.instanceof(File).nullable(),
  eventName: z.string().min(1, '活動名稱不能為空'),
  eventDescription: z.string().min(1, '活動描述不能為空'),
  eventLocation: z.string().min(1, '活動地點不能為空'),
  eventContentBlocks: z.array(contentBlockSchema).optional(),
  faqBlocks: z.array(faqBlockSchema).optional(),

  // session 內容
  sessionBlock: z.array(sessionBlockSchema),
  ticketBlock: z.array(ticketBlockSchema),
  formBlock: formBlockSchema.optional(),
  visibility: z.enum(['public', 'private']),
  bankTransfer: bankTransferSchema,
  cashpayment: CashSchema,
});

// 對應 RHF type
export type EventFormValue = z.infer<typeof eventFormSchema>;
