import React from 'react';
import s from "../../App.module.css";

const QualityScore = ({ score }) => {
  const percentage = (score * 100).toFixed(1);
  let color = "#1f2937";
  if (score < 0.7) color = "#f44336";
  else if (score < 0.9) color = "#FF9800";

  return (
    <div className={s.scoreContainer}>
      <div className={s.scoreLabel}>Качество данных</div>
      <div className={s.scoreBar}>
        <div
          className={s.scoreFill}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className={s.scoreValue}>{percentage}%</div>
    </div>
  );
};

export default QualityScore;