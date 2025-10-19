import React from 'react';
import s from "../../App.module.css";

const StorageRecommendation = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <div className={s.recommendation}>
      <h3>Рекомендуемое хранилище: {recommendation.recommended_storage}</h3>
      <p>{recommendation.reasoning}</p>

      {recommendation.config && (
        <div className={s.storageConfig}>
          <h4>Конфигурация:</h4>
          <p><strong>Партиционирование:</strong> {recommendation.config.partitioning}</p>
          <p><strong>Репликация:</strong> {recommendation.config.replication}</p>
        </div>
      )}
    </div>
  );
};

export default StorageRecommendation;