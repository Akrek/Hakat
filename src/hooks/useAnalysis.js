import { useState } from 'react';
import { apiService } from '../services/api';
import { processAnalysisResults } from '../utils/fileUtils';

export const useAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileId(null);
    setAnalysisId(null);
    setAnalysisResults(null);
    setStatusMessage(
      "Выбран новый файл. Нажмите 'Загрузить файл' для начала анализа."
    );
    setAnalysisProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage("Пожалуйста, сначала выберите файл.");
      return;
    }

    setLoading(true);
    setStatusMessage("Загрузка файла...");

    try {
      const result = await apiService.uploadFile(selectedFile, getFileType(selectedFile.name));
      setFileId(result.file_id);
      setStatusMessage(result.message || "Файл успешно загружен");
      
      // Автоматически запускаем анализ после загрузки
      if (result.file_id) {
        await startAnalysis(result.file_id);
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
      setStatusMessage("Ошибка при загрузке файла: " + error.message);
      setLoading(false);
    }
  };

  const startAnalysis = async (fileIdToAnalyze = null) => {
    const targetFileId = fileIdToAnalyze || fileId;
    
    if (!targetFileId) {
      setStatusMessage("Сначала загрузите файл.");
      setLoading(false);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setStatusMessage("Запуск анализа...");

    try {
      const result = await apiService.startAnalysis(targetFileId, selectedFile.name);
      const newAnalysisId = result.analysis_id || result.pipeline_id;
      setAnalysisId(newAnalysisId);
      setAnalysisProgress(30);
      setStatusMessage("Анализ запущен. Ожидаем результаты...");

      // Запускаем длительный polling для получения результатов
      await pollAnalysisResults(newAnalysisId);

    } catch (error) {
      console.error("Ошибка при запуске анализа:", error);
      setStatusMessage("Ошибка при запуске анализа: " + error.message);
      setIsAnalyzing(false);
      setLoading(false);
    }
  };

  const pollAnalysisResults = async (analysisIdToPoll) => {
    const POLLING_TIMEOUT = 120000;
    const POLLING_INTERVAL = 5000; 
    let timeElapsed = 0;

    const polling = async () => {
      try {
        setAnalysisProgress(40 + Math.min(50, (timeElapsed / POLLING_TIMEOUT) * 50));
        
        const response = await apiService.getAnalysisResults(analysisIdToPoll);

        if (response.status === 202) {
          // Анализ еще не завершен, продолжаем polling
          setStatusMessage(`Анализ выполняется... (${Math.round(timeElapsed/1000)}с)`);
          timeElapsed += POLLING_INTERVAL;
          
          if (timeElapsed >= POLLING_TIMEOUT) {
            throw new Error("Превышено время ожидания анализа");
          }
          
          setTimeout(polling, POLLING_INTERVAL);
          return;
        }

        // Анализ завершен, получаем результаты
        const result = await response.json();
        setAnalysisProgress(100);
        const formattedResults = processAnalysisResults(result);
        setAnalysisResults(formattedResults);
        setStatusMessage("Анализ завершен успешно");

      } catch (error) {
        console.error("Ошибка при получении результатов:", error);
        setStatusMessage("Ошибка при получении результатов анализа: " + error.message);
      } finally {
        setIsAnalyzing(false);
        setLoading(false);
      }
    };

    // Запускаем первоначальный polling
    setTimeout(polling, POLLING_INTERVAL);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setFileId(null);
    setAnalysisId(null);
    setAnalysisResults(null);
    setStatusMessage("Выберите новый файл для анализа");
    setAnalysisProgress(0);
    setIsAnalyzing(false);

    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return {
    selectedFile,
    fileId,
    analysisId,
    analysisResults,
    statusMessage,
    loading,
    analysisProgress,
    isAnalyzing,
    handleFileChange,
    handleUpload,
    resetAnalysis
  };
};

// Вспомогательная функция для определения типа файла
const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['csv', 'json', 'xml'].includes(ext)) {
    return ext;
  }
  return '';
};