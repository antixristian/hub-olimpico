export function MediaIdadeEsportes({ data }) {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">🏃‍♂️ Top 10 Esportes por Média de Idade</h2>
        <p className="section-description">Os esportes com a maior média de idade entre os atletas participantes.</p>
      </div>
       <div className="data-list">
        {data.map((esporte, index) => (
          <div className="data-list-item" key={index} style={{ animationDelay: `${index * 0.05}s` }}>
            <span className="item-title">{esporte.Esporte}</span>
            <span className="item-value">{esporte.IdadeMedia} anos</span>
          </div>
        ))}
      </div>
    </section>
  );
}