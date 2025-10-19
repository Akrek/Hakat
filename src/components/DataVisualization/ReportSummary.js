import React from 'react';
import s from "../../App.module.css";

const ReportSummary = ({ report }) => {
  if (!report) return null;

  const hasCustomReport = report.summary && report.summary !== "Отчёт не сгенерирован.";

  return (
    <div className={s.reportSummary}>
      <h3>Итоговый отчет</h3>
      
      {hasCustomReport ? (
        <div className={s.summaryText}>{report.summary}</div>
      ) : (
        <div className={s.noReport}>
          <p>Автоматический отчет не был сгенерирован. Основные выводы анализа:</p>
        </div>
      )}
      
      {report.recommendations && (
        <>
          <h4>Рекомендации:</h4>
          <ul>
            {report.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </>
      )}

      {report.next_steps && (
        <>
          <h4>Следующие шаги:</h4>
          <ul>
            {report.next_steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ReportSummary;