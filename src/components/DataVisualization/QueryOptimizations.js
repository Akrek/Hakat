import React from 'react';
import s from "../../App.module.css";

const QueryOptimizations = ({ optimizations }) => {
  if (!optimizations) return null;

  return (
    <div className={s.optimizations}>
      <h3>Оптимизация запросов</h3>
      
      {optimizations.optimizations && (
        <>
          <h4>Рекомендации:</h4>
          <ul>
            {optimizations.optimizations.map((opt, index) => (
              <li key={index}>{opt}</li>
            ))}
          </ul>
        </>
      )}

      {optimizations.indexes && optimizations.indexes.length > 0 && (
        <>
          <h4>Индексы:</h4>
          <ul>
            {optimizations.indexes.map((index, idx) => (
              <li key={idx} className={s.codeItem}>{index}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default QueryOptimizations;