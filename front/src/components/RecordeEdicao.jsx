export function RecordeEdicao({ data }) {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">⭐ Recorde de Medalhas em Uma Edição</h2>
        <p className="section-description">A performance mais dominante da história, o maior número de medalhas por um atleta em uma única Olimpíada.</p>
      </div>
       <div className="data-list">
        {data.map((recorde, index) => (
          <div className="data-list-item special-item" key={index} style={{ animationDelay: `${index * 0.05}s` }}>
            <span className="item-title">{recorde.Atleta}</span>
            <span className="item-value">{recorde.TotalDeMedalhas} medalhas em {recorde.cidade} ({recorde.ano} {recorde.temporada})</span>
          </div>
        ))}
      </div>
    </section>
  );
}