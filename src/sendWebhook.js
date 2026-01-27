const axios = require('axios');
require('dotenv').config();

// Recieves webhookUrl as argument now
async function sendToDiscord(webhookUrl, payload) {
  if (!webhookUrl) {
    console.error('URL do Webhook não fornecida.');
    return;
  }

  if (!payload) {
    console.error('Payload vazio, nada para enviar.');
    return;
  }

  // Appends query param required for components v2 if not present
  if (!webhookUrl.includes('with_components=true')) {
    webhookUrl += webhookUrl.includes('?') ? '&with_components=true' : '?with_components=true';
  }

  try {
    const res = await axios.post(webhookUrl, payload, {
      headers: { "Content-Type": "application/json" }
    });
    console.log(`Mensagem enviada para o Discord com sucesso (${webhookUrl.slice(0, 30)}...).`);
  } catch (error) {
    // Log detailed error from Discord if available
    console.error('Erro ao enviar mensagem para o Discord:', error.response?.data || error.message);
  }
}

module.exports = { sendToDiscord };
