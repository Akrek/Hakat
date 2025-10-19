import React from 'react';
import s from "../../App.module.css";

const ETLAnalysis = ({ etlData }) => {
  if (!etlData) return null;

  const hasCode = etlData.python_code && etlData.python_code.trim() !== "";

  return (
    <div className={s.etlAnalysis}>
      <h3>ETL Конфигурация</h3>
      
      {hasCode ? (
        <>
          <h4>Python код:</h4>
          <pre className={s.codeBlock}>{etlData.python_code}</pre>
        </>
      ) : (
        <div className={s.noETL}>
          <p>ETL пайплайн не требуется для данного типа данных.</p>
          <p>Данные могут загружаться напрямую в целевую базу данных.</p>
        </div>
      )}
    </div>
  );
};

export default ETLAnalysis;