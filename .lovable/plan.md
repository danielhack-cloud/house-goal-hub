

## Automated Receipt Parsing System

Yes — this is very doable. The current system already uploads receipt images and saves transactions, but users must manually enter the order total and date. We can enhance this with AI-powered receipt parsing so users just upload a photo and the system extracts the spending data automatically.

### How It Works

1. User uploads a receipt screenshot (already built)
2. Image is uploaded to storage (already built)
3. A backend function receives the image and uses AI (Gemini 2.5 Flash — available via Lovable AI, no API key needed) to extract: order total, order date, and order ID
4. The extracted data auto-fills the form fields, or optionally submits directly with a "pending" status for review

### Implementation Plan

**1. Create a backend function: `parse-receipt`**
- Accepts the uploaded image (as base64 or storage path)
- Sends it to Gemini 2.5 Flash with a prompt like: "Extract the order total, order date, and order ID from this receipt image. Return JSON."
- Returns the parsed data to the frontend

**2. Update the Transactions page (`src/pages/Transactions.tsx`)**
- After the user selects a receipt image, automatically call the `parse-receipt` function
- Auto-populate the Order Date, Order Total, and Order ID fields with the AI-extracted values
- User can review/correct before submitting
- Show a loading state while parsing

**3. Flow**

```text
User uploads receipt image
        │
        ▼
Frontend sends image to parse-receipt edge function
        │
        ▼
Edge function sends to Gemini 2.5 Flash (vision)
        │
        ▼
AI returns { orderDate, orderTotal, orderId }
        │
        ▼
Frontend auto-fills form fields
        │
        ▼
User reviews and clicks "Submit Receipt"
        │
        ▼
Transaction saved to database (status: pending)
```

### Technical Details

- **AI Model**: Gemini 2.5 Flash (multimodal, supports image input, available via Lovable AI — no API key required)
- **Edge Function**: `supabase/functions/parse-receipt/index.ts` — receives image, calls Gemini, returns structured JSON
- **No new database changes needed** — the existing `transactions` table already has all required columns
- **Security**: The edge function will verify the user is authenticated before processing

### What Users Experience

Upload a receipt photo → fields auto-fill with the dollar amount, date, and order ID → review and submit. No manual data entry needed.

