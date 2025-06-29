export function TopPaises({ data }) {
  const getMedalColor = (index) => {
    if (index === 0) return '#FFD700';
    if (index === 1) return '#C0C0C0';
    if (index === 2) return '#CD7F32';
    return '#4A90E2';
  };

  const getMedalIcon = (index) => {
    if (index < 3) return '🏅';
    return '🎖️';
  };

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">🏆 Top 10 Países por Total de Medalhas</h2>
        <p className="section-description">
          Conheça os países que mais conquistaram medalhas na história olímpica
        </p>
      </div>
      <div className="countries-grid">
        {data.map((pais, index) => (
          <div 
            key={pais.NOC} 
            className={`country-card ${index < 3 ? 'podium' : ''}`}
            style={{ '--medal-color': getMedalColor(index), '--index': index }}
          >
            <div className="card-header">
              <span className="position">#{index + 1}</span>
              <span className="medal-icon">{getMedalIcon(index)}</span>
            </div>
            <div className="card-content">
              <h3 className="country-name">{pais.Pais}</h3>
              <p className="country-code">({pais.NOC})</p>
              <div className="medal-count">
                <span className="medal-number">{pais.TotalDeMedalhas}</span>
                <span className="medal-label">medalhas</span>
              </div>
            </div>
            <div className="card-decoration"></div>
          </div>
        ))}
      </div>
    </section>
  );
}