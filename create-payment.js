import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST');

  const API_KEY = process.env.NOWPAYMENTS_API_KEY;
  const { amount, currency } = req.body; // сумма и валюта

  const payload = {
    price_amount: amount,
    price_currency: currency,
    pay_currency: currency,
    order_id: 'order_' + Date.now(),
    order_description: 'Пополнение баланса',
    ipn_callback_url: 'https://jyldammoney.vercel.app/webhook',
    success_url: 'https://jyldammoney.vercel.app/',
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
    res.status(500).send('Ошибка создания платежа');
  }
}
