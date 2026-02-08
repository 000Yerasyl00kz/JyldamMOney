export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  try {
    const { amount, currency } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Некорректная сумма' });
    }

    const API_KEY = process.env.NOWPAYMENTS_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'API_KEY не настроен' });

    const payload = {
      price_amount: amount,
      price_currency: currency,
      pay_currency: currency,
      order_id: 'order_' + Date.now(),
      order_description: 'Пополнение баланса',
      ipn_callback_url: 'https://<YOUR_REAL_VERCEL_URL>/api/webhook', // webhook endpoint
      success_url: 'https://<YOUR_REAL_VERCEL_URL>/success'           // страница после успешной оплаты
    };

    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!data.invoice_url) {
      console.error('Ошибка NowPayments:', data);
      return res.status(500).json({ error: 'Ошибка создания платежа на NowPayments', details: data });
    }

    res.status(200).json({ paymentUrl: data.invoice_url });

  } catch (err) {
    console.error('Ошибка create-payment:', err);
    res.status(500).json({ error: 'Ошибка создания платежа' });
  }
}

