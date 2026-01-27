function formatDiscordMessage(jobData) {
  if (!jobData) return null;

  const technologies = Array.isArray(jobData.tecnologias)
    ? jobData.tecnologias.join(', ')
    : (jobData.tecnologias || 'Não informadas');

  // Format requirements to start with "-"
  let requirementsText = 'Não informado';
  if (Array.isArray(jobData.requisitos_tecnicos)) {
    requirementsText = jobData.requisitos_tecnicos.map(req => `- ${req}`).join('\n');
  } else if (typeof jobData.requisitos_tecnicos === 'string') {
    requirementsText = jobData.requisitos_tecnicos
      .split('\n')
      .map(line => line.trim().startsWith('-') ? line.trim() : `- ${line.trim()}`)
      .join('\n');
  }

  const components = [
    {
      "type": 17,
      "accent_color": 1722367,
      "spoiler": false,
      "components": [
        {
          "type": 10,
          "content": `## ${jobData.titulo_vaga}`
        },
        {
          "type": 10,
          "content": `**Nível**: ${jobData.nivel_vaga || 'Não informado'}`
        },
        {
          "type": 10,
          "content": `**Descrição**: ${jobData.descricao_vaga || 'Sem descrição'}`
        },
        {
          "type": 10,
          "content": `**Requisitos**:\n${requirementsText}`
        },
        {
          "type": 10,
          "content": `**Tecnologias**: ${technologies}.`
        },
        {
          "type": 10,
          "content": `**Salário**: ${jobData.salario || 'A combinar'}`
        },
        {
          "type": 10,
          "content": `**Modelo**: ${jobData.forma_trabalho || 'Não informado'}`
        },
        {
          "type": 10,
          "content": `**Local**: ${jobData.local || 'Não informado'}`
        },
        {
          "type": 10,
          "content": `-# <@&1369762080651087903>  Essa vaga foi retirada do site [meupadrinho.com.br](https://meupadrinho.com.br).`
        }
      ]
    },
    {
      "type": 14,
      "divider": true,
      "spacing": 1
    },
    {
      "type": 1,
      "components": [
        {
          "type": 2,
          "style": 5,
          "label": "Candidatar-se",
          "emoji": null,
          "disabled": false,
          "url": jobData.link_vaga
        }
      ]
    }
  ];

  const companyLink = jobData.link_pagina_linkedin || jobData.link_empresa;
  if (companyLink) {
    components[2].components.push({
      "type": 2,
      "style": 5,
      "label": `Empresa ${jobData.nome_empresa || ''}`,
      "emoji": null,
      "disabled": false,
      "url": companyLink
    });
  }

  return {
    components: components
  };
}

module.exports = { formatDiscordMessage };
