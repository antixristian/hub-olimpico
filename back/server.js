import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Corrige o problema de serialização do BigInt
BigInt.prototype.toJSON = function() { return this.toString() };

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Configuração de CORS - está correta!
app.use(cors({
  origin: 'https://hub-olimpico.vercel.app' 
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bem-vindo à API do Hub Olímpico!');
});

// ===================================================
// ROTAS DA API - COM NOMES DE TABELAS CORRIGIDOS
// ===================================================

// Rota para a "Consulta 1": Top 10 Países por Total de Medalhas
app.get('/api/paises/top10-medalhas', async (req, res) => {
  try {
    const query = `
      SELECT
          p.nome AS Pais,
          p.NOC,
          COUNT(paep.medalha) AS TotalDeMedalhas
      FROM participa_atleta_edicao_prova paep
      JOIN atleta a ON paep.fk_Atleta_id = a.id
      JOIN pais p ON a.fk_Pais_NOC = p.NOC
      WHERE paep.medalha IS NOT NULL AND paep.medalha <> 'NA'
      GROUP BY p.nome, p.NOC
      ORDER BY TotalDeMedalhas DESC
      LIMIT 10;
    `;
    const resultado = await prisma.$queryRawUnsafe(query);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os dados.' });
  }
});

// Rota para a "Consulta 2": Medalhas por Atleta Brasileiro
app.get('/api/atletas/medalhas-por-atleta-brasil', async (req, res) => {
    try {
        const query = `
            SELECT
                a.nome AS Atleta,
                a.sexo,
                COUNT(paep.medalha) AS TotalDeMedalhas
            FROM
                atleta a
            LEFT JOIN
                participa_atleta_edicao_prova paep ON a.id = paep.fk_Atleta_id AND paep.medalha IS NOT NULL
            WHERE
                a.fk_Pais_NOC = 'BRA'
            GROUP BY
                a.id, a.nome, a.sexo
            ORDER BY
                TotalDeMedalhas DESC, Atleta ASC
            LIMIT 15;
        `;
        const resultado = await prisma.$queryRawUnsafe(query);
        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao buscar os dados.' });
    }
});

// Rota para a "Consulta 3": Atletas que ganharam medalhas em Verão e Inverno
app.get('/api/atletas/verao-e-inverno', async (req, res) => {
    try {
        const query = `
            SELECT
                a.nome AS Atleta,
                a.sexo
            FROM atleta a
            WHERE
                a.id IN (
                    SELECT paep.fk_Atleta_id
                    FROM participa_atleta_edicao_prova paep
                    JOIN edicao e ON paep.fk_Edicao_id = e.id
                    WHERE paep.medalha IS NOT NULL AND e.temporada = 'Summer'
                )
                AND a.id IN (
                    SELECT paep.fk_Atleta_id
                    FROM participa_atleta_edicao_prova paep
                    JOIN edicao e ON paep.fk_Edicao_id = e.id
                    WHERE paep.medalha IS NOT NULL AND e.temporada = 'Winter'
                );
        `;
        const resultado = await prisma.$queryRawUnsafe(query);
        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao buscar os dados.' });
    }
});

// Rota para a "Consulta 4": Média de Idade dos Atletas por Esporte
app.get('/api/esportes/media-idade', async (req, res) => {
    try {
        const query = `
            SELECT
                e.nome AS Esporte,
                ROUND(AVG(paep.idade_atleta), 1) AS IdadeMedia
            FROM participa_atleta_edicao_prova paep
            JOIN prova p ON paep.fk_Prova_id = p.id
            JOIN esporte e ON p.fk_Esporte_id = e.id
            WHERE paep.idade_atleta IS NOT NULL
            GROUP BY e.nome
            ORDER BY IdadeMedia DESC
            LIMIT 10;
        `;
        const resultado = await prisma.$queryRawUnsafe(query);
        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao buscar os dados.' });
    }
});

// Rota para a "Consulta 5": Atleta(s) com o Maior Número de Medalhas Numa Única Edição
app.get('/api/atletas/recorde-uma-edicao', async (req, res) => {
    try {
        const query = `
            WITH MedalhasPorEdicao AS (
                SELECT
                    fk_Atleta_id,
                    fk_Edicao_id,
                    COUNT(medalha) AS TotalDeMedalhas
                FROM
                    participa_atleta_edicao_prova
                WHERE
                    medalha IS NOT NULL
                GROUP BY
                    fk_Atleta_id,
                    fk_Edicao_id
            )
            SELECT
                a.nome AS Atleta,
                e.ano,
                e.temporada,
                e.cidade,
                mpe.TotalDeMedalhas
            FROM
                MedalhasPorEdicao mpe
            JOIN
                atleta a ON mpe.fk_Atleta_id = a.id
            JOIN
                edicao e ON mpe.fk_Edicao_id = e.id
            WHERE
                mpe.TotalDeMedalhas = (
                    SELECT MAX(TotalDeMedalhas) FROM MedalhasPorEdicao
                );
        `;
        const resultado = await prisma.$queryRawUnsafe(query);
        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao buscar os dados.' });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});