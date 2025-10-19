import React from 'react';
import s from "../../App.module.css";

const AnalysisMetadata = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <div className={s.metadata}>
      <h3>Метаданные анализа</h3>
      <div className={s.statsGrid}>
        {metadata.processing_time && (
          <div className={s.stat}>
            <span className={s.statValue}>{metadata.processing_time.toFixed(2)}s</span>
            <span className={s.statLabel}>Время обработки</span>
          </div>
        )}
        {metadata.confidence_score && (
          <div className={s.stat}>
            <span className={s.statValue}>{(metadata.confidence_score * 100).toFixed(1)}%</span>
            <span className={s.statLabel}>Уверенность</span>
          </div>
        )}
      </div>

      {metadata.agents_used && metadata.agents_used.length > 0 && (
        <>
          <h4>Использованные агенты:</h4>
          <div className={s.dataTypes}>
            {metadata.agents_used.map((agent, index) => (
              <span key={index} className={s.dataType}>
                {agent}
              </span>
            ))}
          </div>
        </>
      )}

      {metadata.errors && metadata.errors.length > 0 && (
        <>
          <h4>Ошибки:</h4>
          <div className={s.errors}>
            {metadata.errors.map((error, index) => (
              <div key={index} className={s.error}>{error}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisMetadata;