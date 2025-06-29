import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import { LoadingSpinner, ErrorMessage } from './components/LoadingError';
import { TopPaises } from './components/TopPaises';
import { AtletasBrasil } from './components/AtletasBrasil';
import { AtletasVeraoInverno } from './components/AtletasVeraoInverno';
import { MediaIdadeEsportes } from './components/MediaIdadeEsportes';
import { RecordeEdicao } from './components/RecordeEdicao';

// A URL base da nossa API vinda das variáveis de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usando Promise.all para buscar todos os dados em paralelo
      const [
        paisesRes,
        atletasBrasilRes,
        veraoInvernoRes,
        mediaIdadeRes,
        recordeEdicaoRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/paises/top10-medalhas`),
        axios.get(`${API_BASE_URL}/api/atletas/medalhas-por-atleta-brasil`),
        axios.get(`${API_BASE_URL}/api/atletas/verao-e-inverno`),
        axios.get(`${API_BASE_URL}/api/esportes/media-idade`),
        axios.get(`${API_BASE_URL}/api/atletas/recorde-uma-edicao`)
      ]);

      setApiData({
        paises: paisesRes.data,
        atletasBrasil: atletasBrasilRes.data,
        veraoInverno: veraoInvernoRes.data,
        mediaIdade: mediaIdadeRes.data,
        recordeEdicao: recordeEdicaoRes.data,
      });

    } catch (err) {
      setError('Falha ao buscar dados da API. Verifique se o backend está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="olympic-rings">
            <div className="ring ring-blue"></div>
            <div className="ring ring-yellow"></div>
            <div className="ring ring-black"></div>
            <div className="ring ring-green"></div>
            <div className="ring ring-red"></div>
          </div>
          <h1 className="main-title">Hub Olímpico</h1>
          <p className="subtitle">Dados e Recordes Históricos das Olimpíadas</p>
        </div>
      </header>

      <main className="main-content">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage error={error} onRetry={fetchData} />}
        
        {apiData && !loading && !error && (
          <>
            <TopPaises data={apiData.paises} />
            <AtletasBrasil data={apiData.atletasBrasil} />
            <RecordeEdicao data={apiData.recordeEdicao} />
            <MediaIdadeEsportes data={apiData.mediaIdade} />
            <AtletasVeraoInverno data={apiData.veraoInverno} />
          </>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 Hub Olímpico - Dados históricos das Olimpíadas</p>
      </footer>
    </div>
  );
}

export default App;