export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const data = req.body;

  // Проверяем статус платежа
  if (data.payment_status === 'finished') {
    console.log('Платёж завершён:', data.order_id);
    console.log('Сумма:', data.price_amount, data.price_currency);

    // TODO: здесь нужно добавить начисление баланса пользователю
    // Пример: запись в базу данных / JSON / Supabase
  }

  // Важно вернуть 200 OK для подтверждения провайдеру
  res.status(200).send('OK');
}
