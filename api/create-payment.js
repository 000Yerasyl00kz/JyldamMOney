export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { amount, currency } = req.body;

    const API_KEY = process.env.NOWPAYMENTS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: 'API KEY not set' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const payload = {
      price_amount: Number(amount),
      price_currency: 'USD', // ⚠️ ВАЖНО: сначала USD
      pay_currency: 'USDTTRC20', // ⚠️ ВАЖНО: сеть
      order_id: 'order_' + Date.now(),
      order_description: 'Balance top-up',

      ipn_callback_url: 'https://jyldammoney.vercel.app/api/webhook',
      success_url: 'https://jyldammoney.vercel.app/success',
      cancel_url: 'https://jyldammoney.vercel.app'
    };

    console.log('Sending payload:', payload);

    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    console.log('NowPayments raw response:', text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: 'Invalid JSON from NowPayments',
        raw: text
      });
    }

    if (!response.ok) {
      return res.status(500).json({
        error: 'NowPayments error',
        status: response.status,
        data
      });
    }

    if (!data.invoice_url) {
      return res.status(500).json({
        error: 'No invoice_url',
        data
      });
    }

    return res.status(200).json({
      paymentUrl: data.invoice_url
    });

  } catch (err) {
    console.error('Server error:', err);

    return res.status(500).json({
      error: 'Server exception',
      message: err.message
    });
  }
}
