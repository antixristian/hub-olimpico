import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import neatCsv from 'neat-csv';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o processo de seeding...');

  // --- 1. Limpando o banco de dados ---
  console.log('🗑️ Limpando dados antigos...');
  // Nomes corrigidos para corresponder ao seu schema.prisma (tudo minúsculo)
  await prisma.participa_atleta_edicao_prova.deleteMany({});
  await prisma.atleta.deleteMany({});
  await prisma.prova.deleteMany({});
  await prisma.edicao.deleteMany({});
  await prisma.esporte.deleteMany({});
  await prisma.pais.deleteMany({});
  console.log('✅ Dados antigos limpos.');

  // --- 2. Populando a tabela Pais ---
  console.log('🌎 Populando Países...');
  const nocFile = await fs.readFile('./prisma/data/noc_regions.csv');
  const nocData = await neatCsv(nocFile);
  const paisesParaCriar = nocData
    .filter(pais => pais.NOC && pais.region)
    .map(pais => ({
        NOC: pais['\uFEFFNOC'] || pais.NOC,
        nome: pais.region
    }));
  
  await prisma.pais.createMany({
    data: paisesParaCriar,
    skipDuplicates: true,
  });
  console.log('✅ Países populados.');

  // --- 3. Lendo o arquivo principal ---
  console.log('🏃 Lendo dados dos eventos...');
  const eventsFile = await fs.readFile('./prisma/data/athlete_events.csv');
  const eventsData = await neatCsv(eventsFile);
  console.log(`📄 ${eventsData.length} registos lidos.`);

  // --- 4. Populando Esporte, Edicao, e Atleta ---
  console.log('🏅 Populando Esportes...');
  const esportesSet = new Set(eventsData.map(e => e.Sport).filter(Boolean));
  await prisma.esporte.createMany({
    data: Array.from(esportesSet).map(nome => ({ nome })),
    skipDuplicates: true,
  });
  console.log('✅ Esportes populados.');

  console.log('🏟️ Populando Edições...');
  const edicoesMap = new Map();
  eventsData.forEach(e => {
    if (e.Year && e.Season) {
      const key = `${e.Year}-${e.Season}`;
      if (!edicoesMap.has(key)) {
        edicoesMap.set(key, { ano: parseInt(e.Year), temporada: e.Season, cidade: e.City });
      }
    }
  });
  await prisma.edicao.createMany({
    data: Array.from(edicoesMap.values()),
    skipDuplicates: true,
  });
  console.log('✅ Edições populadas.');

  console.log('🤸 Populando Atletas...');
  const paisesExistentes = new Set(paisesParaCriar.map(p => p.NOC));
  const atletasMap = new Map();
  eventsData.forEach(e => {
    if (e.ID && !atletasMap.has(e.ID) && paisesExistentes.has(e.NOC)) {
      atletasMap.set(e.ID, {
        id: parseInt(e.ID),
        nome: e.Name,
        sexo: e.Sex,
        fk_Pais_NOC: e.NOC,
      });
    }
  });
  await prisma.atleta.createMany({
    data: Array.from(atletasMap.values()),
    skipDuplicates: true,
  });
  console.log('✅ Atletas populados.');

  // --- 5. Mapeando IDs para criar as relações ---
  console.log('🗺️ Mapeando IDs para as relações...');
  const todosEsportes = await prisma.esporte.findMany();
  const esporteMap = Object.fromEntries(todosEsportes.map(e => [e.nome, e.id]));
  
  const todasEdicoes = await prisma.edicao.findMany();
  const edicaoMap = Object.fromEntries(todasEdicoes.map(e => [`${e.ano}-${e.temporada}`, e.id]));

  // --- 6. Populando Provas ---
  console.log('🏁 Populando Provas...');
  const provasMap = new Map();
  eventsData.forEach(e => {
    if (e.Event && !provasMap.has(e.Event)) {
        provasMap.set(e.Event, {
            nome: e.Event,
            fk_Esporte_id: esporteMap[e.Sport]
        });
    }
  });
  await prisma.prova.createMany({
    data: Array.from(provasMap.values()).filter(p => p.fk_Esporte_id),
    skipDuplicates: true,
  });
  console.log('✅ Provas populadas.');

  // --- 7. Populando a tabela de Participações ---
  const todasProvas = await prisma.prova.findMany();
  const provaMap = Object.fromEntries(todasProvas.map(p => [p.nome, p.id]));
  
  console.log('🔗 Populando Participações...');
  const participacoesSet = new Set();
  const participacoesParaCriar = [];
  
  eventsData.forEach(e => {
    const atletaId = parseInt(e.ID);
    const edicaoId = edicaoMap[`${e.Year}-${e.Season}`];
    const provaId = provaMap[e.Event];

    const chaveUnica = `${atletaId}-${edicaoId}-${provaId}`;

    if (atletaId && edicaoId && provaId && !participacoesSet.has(chaveUnica)) {
        participacoesParaCriar.push({
            fk_Atleta_id: atletaId,
            fk_Edicao_id: edicaoId,
            fk_Prova_id: provaId,
            idade_atleta: e.Age && e.Age !== 'NA' ? parseInt(e.Age) : null,
            altura_atleta: e.Height && e.Height !== 'NA' ? parseFloat(e.Height) : null,
            peso_atleta: e.Weight && e.Weight !== 'NA' ? parseFloat(e.Weight) : null,
            medalha: e.Medal && e.Medal !== 'NA' ? e.Medal : null,
        });
        participacoesSet.add(chaveUnica);
    }
  });

  console.log(`📝 Inserindo ${participacoesParaCriar.length} participações em lotes...`);
  const batchSize = 10000;
  for (let i = 0; i < participacoesParaCriar.length; i += batchSize) {
    const batch = participacoesParaCriar.slice(i, i + batchSize);
    await prisma.participa_atleta_edicao_prova.createMany({
      data: batch,
      skipDuplicates: true
    });
    console.log(`📦 Lote ${Math.floor(i / batchSize) + 1} de participações inserido.`);
  }

  console.log('✅ Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });