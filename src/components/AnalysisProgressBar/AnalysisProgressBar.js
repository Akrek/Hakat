import React from 'react';
import s from "../../App.module.css";

const AnalysisProgressBar = ({ isAnalyzing, analysisProgress }) => {
  if (!isAnalyzing) return null;

  return (
    <div className={s.progressContainer}>
      <div className={s.progressLabel}>
        Выполняется анализ... {analysisProgress}%
      </div>
      <div className={s.progressBar}>
        <div 
          className={s.progressFill}
          style={{ width: `${analysisProgress}%` }}
        ></div>
      </div>
      <div className={s.progressNote}>
        Это может занять до 2 минут. Пожалуйста, не закрывайте страницу.
      </div>
    </div>
  );
};

export default AnalysisProgressBar;