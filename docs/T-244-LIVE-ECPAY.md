# T-244 live ECPay (after STOP-014)

When owner reports「STOP-014 特約核准」or sandbox shop keys for production testing:

## Nest env (Render + local)

```
ECPAY_MERCHANT_ID=...
ECPAY_HASH_KEY=...
ECPAY_HASH_IV=...
ECPAY_MODE=live
```

- `ECPAY_MODE=sandbox` (default): checkout URL stays `payment-stage.ecpay.com.tw`
- `ECPAY_MODE=live`: checkout URL `payment.ecpay.com.tw` (Wave I code path)

## Webhook

Point ECPay merchant webhook to:

```
https://<render-host>.onrender.com/api/payments/webhook
```

## Refunds

Manual path documented in `payment-gateway.refundPathNote()` — ECPay merchant portal until API refund is scoped.

## Copy

Do not claim commercial launch until first paid event succeeds end-to-end.

## Smoke

1. Small-amount live payment on staging event
2. Webhook `rtnCode=1` → order confirmed → tickets issued
3. Portal order page shows paid state
