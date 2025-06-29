export function AtletasBrasil({ data }) {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">🇧🇷 Medalhas por Atleta Brasileiro</h2>
        <p className="section-description">Maiores medalhistas do Brasil.</p>
      </div>
      <div className="data-list">
        {data.map((atleta, index) => (
          <div className="data-list-item" key={index} style={{ animationDelay: `${index * 0.05}s` }}>
            <span className="item-title">{atleta.Atleta} ({atleta.sexo})</span>
            <span className="item-value">{atleta.TotalDeMedalhas} medalhas</span>
          </div>
        ))}
      </div>
    </section>
  );
}