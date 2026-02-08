export default function Home() {
  const handlePay = async () => {
    const res = await fetch('/create-payment', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ amount: 10, currency: 'USDT' })
    });
    const data = await res.json();
    window.location.href = data.paymentUrl; // редирект на страницу оплаты
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Пополнить баланс</h1>
      <button onClick={handlePay} style={{ padding: '10px 20px', fontSize: '18px' }}>
        Пополнить
      </button>
    </div>
  );
}
