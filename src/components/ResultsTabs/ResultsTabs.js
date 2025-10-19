import React from 'react';
import s from "../../App.module.css";
import {
  QualityScore,
  ConfidenceScore,
  DataCharacteristics,
  StorageRecommendation,
  DDLScripts,
  ETLAnalysis,
  QueryOptimizations,
  ReportSummary,
  AnalysisMetadata
} from "../DataVisualization/DataVisualization";

const ResultsTabs = ({ activeTab, onTabChange, analysisResults }) => {
  if (!analysisResults || analysisResults.status !== "completed") return null;

  return (
    <div className={s.results}>
      <div className={s.tabs}>
        <button
          className={activeTab === "overview" ? s.activeTab : s.tab}
          onClick={() => onTabChange("overview")}
        >
          Обзор
        </button>
        <button
          className={activeTab === "data" ? s.activeTab : s.tab}
          onClick={() => onTabChange("data")}
        >
          Анализ данных
        </button>
        <button
          className={activeTab === "storage" ? s.activeTab : s.tab}
          onClick={() => onTabChange("storage")}
        >
          Хранилище
        </button>
        <button
          className={activeTab === "ddl" ? s.activeTab : s.tab}
          onClick={() => onTabChange("ddl")}
        >
          DDL
        </button>
        <button
          className={activeTab === "etl" ? s.activeTab : s.tab}
          onClick={() => onTabChange("etl")}
        >
          ETL
        </button>
        <button
          className={activeTab === "optimization" ? s.activeTab : s.tab}
          onClick={() => onTabChange("optimization")}
        >
          Оптимизация
        </button>
        <button
          className={activeTab === "report" ? s.activeTab : s.tab}
          onClick={() => onTabChange("report")}
        >
          Отчет
        </button>
        <button
          className={activeTab === "metadata" ? s.activeTab : s.tab}
          onClick={() => onTabChange("metadata")}
        >
          Метаданные
        </button>
      </div>

      <div className={s.tabContent}>
        {activeTab === "overview" && (
          <>
            {analysisResults.result?.DATA_ANALYZER?.result?.quality_score && (
              <QualityScore score={analysisResults.result.DATA_ANALYZER.result.quality_score} />
            )}
            {analysisResults.metadata?.confidence_score && (
              <ConfidenceScore score={analysisResults.metadata.confidence_score} />
            )}
            {analysisResults.result?.DATA_ANALYZER?.result && (
              <DataCharacteristics data={analysisResults.result.DATA_ANALYZER.result} />
            )}
            {analysisResults.result?.DB_SELECTOR?.result && (
              <StorageRecommendation recommendation={analysisResults.result.DB_SELECTOR.result} />
            )}
            {analysisResults.result?.REPORT_GENERATOR?.result && (
              <ReportSummary report={analysisResults.result.REPORT_GENERATOR.result} />
            )}
          </>
        )}

        {activeTab === "data" && analysisResults.result?.DATA_ANALYZER?.result && (
          <DataCharacteristics data={analysisResults.result.DATA_ANALYZER.result} />
        )}

        {activeTab === "storage" && analysisResults.result?.DB_SELECTOR?.result && (
          <StorageRecommendation recommendation={analysisResults.result.DB_SELECTOR.result} />
        )}

        {activeTab === "ddl" && analysisResults.result?.DDL_GENERATOR?.result && (
          <DDLScripts ddlData={analysisResults.result.DDL_GENERATOR.result} />
        )}

        {activeTab === "etl" && analysisResults.result?.ETL_BUILDER?.result && (
          <ETLAnalysis etlData={analysisResults.result.ETL_BUILDER.result} />
        )}

        {activeTab === "optimization" && analysisResults.result?.QUERY_OPTIMIZER?.result && (
          <QueryOptimizations optimizations={analysisResults.result.QUERY_OPTIMIZER.result} />
        )}

        {activeTab === "report" && analysisResults.result?.REPORT_GENERATOR?.result && (
          <ReportSummary report={analysisResults.result.REPORT_GENERATOR.result} />
        )}

        {activeTab === "metadata" && analysisResults.metadata && (
          <AnalysisMetadata metadata={analysisResults.metadata} />
        )}
      </div>
    </div>
  );
};

export default ResultsTabs;