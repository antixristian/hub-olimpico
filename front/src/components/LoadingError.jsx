export function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Carregando dados olímpicos...</p>
    </div>
  );
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">Ops! Algo deu errado</h2>
      <p className="error-message">{error}</p>
      <button 
        className="retry-button" 
        onClick={onRetry}
      >
        Tentar Novamente
      </button>
    </div>
  );
}