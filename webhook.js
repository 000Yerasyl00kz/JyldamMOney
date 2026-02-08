export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST');

  const data = req.body;

  // Статус успешного платежа
  if (data.payment_status === 'finished') {
    const orderId = data.order_id;
    const amount = data.price_amount;
    console.log('Платёж завершён', orderId, amount);
    // TODO: начислить баланс пользователю
  }

  res.status(200).send('OK');
}
