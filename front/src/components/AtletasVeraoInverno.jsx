export function AtletasVeraoInverno({ data }) {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">☀️❄️ Atletas com Medalhas em Verão e Inverno</h2>
        <p className="section-description">O seleto grupo de atletas que subiram ao pódio em ambas as estações.</p>
      </div>
       <div className="data-list">
        {data.length > 0 ? data.map((atleta, index) => (
          <div className="data-list-item" key={index} style={{ animationDelay: `${index * 0.05}s` }}>
            <span className="item-title">{atleta.Atleta}</span>
            <span className="item-value">({atleta.sexo})</span>
          </div>
        )) : <p className="no-data-message">Nenhum atleta encontrado com esta proeza.</p>}
      </div>
    </section>
  );
}