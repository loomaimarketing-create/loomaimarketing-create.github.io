exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, company, plan, message } = data;

    const text = `🎯 New Lead from LoomAI App!

👤 Name: ${name}
📧 Email: ${email}
🏢 Company: ${company || 'Not specified'}
💰 Plan: ${plan}
📝 Message: ${message || 'No message'}`;

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    if (response.ok) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: true })
      };
    } else {
      throw new Error('Telegram API error');
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message' })
    };
  }
};
