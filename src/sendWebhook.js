const axios = require('axios');

async function sendToDiscord(webhookUrl, payload) {
  if (!webhookUrl) {
    console.error('URL do Webhook não fornecida.');
    return;
  }

  if (!payload) {
    console.error('Payload vazio, nada para enviar.');
    return;
  }

  const urls = webhookUrl.split(',').map(url => url.trim());

  for (let url of urls) {
    if (!url) continue;

    if (!url.includes('with_components=true')) {
      url += url.includes('?') ? '&with_components=true' : '?with_components=true';
    }

    try {
      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(`Mensagem enviada para o Discord com sucesso (${url.slice(0, 30)}...).`);
    } catch (error) {
      console.error(`Erro ao enviar mensagem para o Discord (${url.slice(0, 30)}...):`, error.response?.data || error.message);
    }
  }
}

module.exports = { sendToDiscord };
