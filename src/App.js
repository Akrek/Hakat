import React, { useState } from 'react';
import s from "./App.module.css";
import { useAnalysis } from './hooks/useAnalysis';
import FileUpload from './components/FileUpload/FileUpload';
import AnalysisProgressBar from './components/AnalysisProgressBar/AnalysisProgressBar';
import ResultsTabs from './components/ResultsTabs/ResultsTabs';

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    selectedFile,
    analysisResults,
    statusMessage,
    loading,
    analysisProgress,
    isAnalyzing,
    handleFileChange,
    handleUpload,
    resetAnalysis
  } = useAnalysis();

  return (
    <div className={s.app}>
      <div className={s.block}>
        <h1 className={s.title}>Интеллектуальный цифровой инженер данных</h1>

        {analysisResults && (
          <button className={s.resetButton} onClick={resetAnalysis}>
            Новый анализ
          </button>
        )}

        <FileUpload
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          loading={loading}
          isAnalyzing={isAnalyzing}
          statusMessage={statusMessage}
        />

        <AnalysisProgressBar
          isAnalyzing={isAnalyzing}
          analysisProgress={analysisProgress}
        />

        <ResultsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          analysisResults={analysisResults}
        />
      </div>
    </div>
  );
}

export default App;