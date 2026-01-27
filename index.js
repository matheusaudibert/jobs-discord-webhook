const { fetchLatestJob } = require('./src/api');
const { formatDiscordMessage } = require('./src/formatter');
const { sendToDiscord } = require('./src/sendWebhook');
require('dotenv').config();

// Intervalo de 5 minutos (5 * 60 * 1000 milissegundos)
const INTERVAL_MS = 5 * 60 * 1000;

// Configuração das rotas e webhooks
const TRACKERS = [
  { key: 'estagio', endpoint: '/estagio', envVar: 'ESTAGIO_WEBHOOK_URL', lastUrl: null },
  { key: 'junior', endpoint: '/junior', envVar: 'JUNIOR_WEBHOOK_URL', lastUrl: null },
  { key: 'pleno', endpoint: '/pleno', envVar: 'PLENO_WEBHOOK_URL', lastUrl: null },
  { key: 'senior', endpoint: '/senior', envVar: 'SENIOR_WEBHOOK_URL', lastUrl: null }
];

async function run() {
  console.log('Iniciando ciclo de verificação de vagas...');

  for (const tracker of TRACKERS) {
    const jobData = await fetchLatestJob(tracker.endpoint);

    if (jobData) {
      if (jobData.link_vaga === tracker.lastUrl) {
        console.log(`[${tracker.key.toUpperCase()}] Nenhuma vaga nova (link repetido).`);
        continue;
      }

      console.log(`[${tracker.key.toUpperCase()}] Nova vaga encontrada: ${jobData.titulo_vaga}`);
      const payload = formatDiscordMessage(jobData);
      const webhookUrl = process.env[tracker.envVar];

      if (webhookUrl) {
        await sendToDiscord(webhookUrl, payload);
        tracker.lastUrl = jobData.link_vaga;
      } else {
        console.error(`[${tracker.key.toUpperCase()}] Variável de ambiente ${tracker.envVar} não definida.`);
      }
    } else {
      console.log(`[${tracker.key.toUpperCase()}] Não foi possível obter dados da vaga.`);
    }
  }
}

// Executa imediatamente ao iniciar
run();

// Configura o intervalo
setInterval(run, INTERVAL_MS);

console.log('Serviço de Bot de Vagas iniciado. Rodando a cada 5 minutos.');
