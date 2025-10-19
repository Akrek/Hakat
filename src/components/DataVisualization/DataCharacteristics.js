import React from 'react';
import s from "../../App.module.css";

const DataCharacteristics = ({ data }) => {
  if (!data) return null;

  return (
    <div className={s.characteristics}>
      <h3>Характеристики данных</h3>
      <div className={s.statsGrid}>
        <div className={s.stat}>
          <span className={s.statValue}>{data.data_type}</span>
          <span className={s.statLabel}>Тип данных</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>{data.characteristics?.volume}</span>
          <span className={s.statLabel}>Объем</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>{data.characteristics?.update_frequency}</span>
          <span className={s.statLabel}>Частота обновления</span>
        </div>
      </div>

      {data.structure?.key_fields && data.structure.key_fields.length > 0 && (
        <>
          <h4>Ключевые поля:</h4>
          <div className={s.dataTypes}>
            {data.structure.key_fields.map((field, index) => (
              <span key={index} className={s.dataType}>
                {field}
              </span>
            ))}
          </div>
        </>
      )}

      {data.structure?.partition_fields && data.structure.partition_fields.length > 0 && (
        <>
          <h4>Поля для партиционирования:</h4>
          <div className={s.dataTypes}>
            {data.structure.partition_fields.map((field, index) => (
              <span key={index} className={s.dataType}>
                {field}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DataCharacteristics;