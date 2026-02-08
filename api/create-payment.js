import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const { amount, currency } = req.body;
  const API_KEY = process.env.NOWPAYMENTS_API_KEY; // ключ хранится в Environment Variables Vercel

  if (!amount || amount <= 0) return res.status(400).json({ error: 'Некорректная сумма' });

  const payload = {
    price_amount: amount,
    price_currency: currency,
    pay_currency: currency,
    order_id: 'order_' + Date.now(),
    order_description: 'Пополнение баланса',
    ipn_callback_url: 'https://jyldammoney.vercel.app', // сюда NowPayments пришлёт уведомление
    success_url: 'https://jyldammoney.vercel.app' // после успешного платежа
  };

  try {
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.status(200).json({ paymentUrl: data.invoice_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка создания платежа' });
  }
}
