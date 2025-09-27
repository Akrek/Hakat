import file from "./file.png";
import s from "./App.module.css";
import React, { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [storagePath, setStoragePath] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // СБРАСЫВАЕМ ВСЕ РЕЗУЛЬТАТЫ ПРИ ВЫБОРЕ НОВОГО ФАЙЛА
    setStoragePath(null);
    setAnalysisId(null);
    setAnalysisResults(null);
    setStatusMessage(
      "Выбран новый файл. Нажмите 'Загрузить файл' для начала анализа."
    );
    setActiveTab("overview");
  };

  // 1. Загрузка файла
  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage("Пожалуйста, сначала выберите файл.");
      return;
    }

    setLoading(true);
    setStatusMessage("Загрузка файла...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const uploadUrl =
      "http://localhost:8081/api/v1/files/upload?user_id=test-user-test";

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const result = await response.json();
      setStoragePath(result.storage_path);
      setStatusMessage(`✅ ${result.message}`);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
      setStatusMessage("❌ Ошибка при загрузке файла.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Запуск анализа
  const startAnalysis = async () => {
    if (!storagePath) {
      setStatusMessage("Сначала загрузите файл.");
      return;
    }

    setLoading(true);
    setStatusMessage("Запуск анализа...");

    const pathParts = storagePath.split("/");
    const fileId = pathParts[2];

    const requestData = {
      file_id: fileId,
      user_id: "test-user-test",
      file_path: storagePath,
    };

    try {
      const response = await fetch(
        "http://localhost:8083/api/v1/analysis/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisId(result.analysis_id);
      setStatusMessage(`✅ ${result.message}`);
    } catch (error) {
      console.error("Ошибка при запуске анализа:", error);
      setStatusMessage("❌ Ошибка при запуске анализа.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Проверка статуса анализа
  const checkAnalysisStatus = async () => {
    if (!analysisId) {
      setStatusMessage("Сначала запустите анализ.");
      return;
    }

    setLoading(true);
    setStatusMessage("Проверка статуса анализа...");

    try {
      const response = await fetch(
        `http://localhost:8083/api/v1/analysis/status/${analysisId}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResults(result);
      setStatusMessage(`✅ ${result.message}`);
    } catch (error) {
      console.error("Ошибка при проверке статуса:", error);
      setStatusMessage("❌ Ошибка при проверке статуса анализа.");
    } finally {
      setLoading(false);
    }
  };

  // Функция для полного сброса (можно добавить кнопку "Новый анализ")
  const resetAnalysis = () => {
    setSelectedFile(null);
    setStoragePath(null);
    setAnalysisId(null);
    setAnalysisResults(null);
    setStatusMessage("Выберите новый файл для анализа");
    setActiveTab("overview");

    // Сброс значения input file
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Компоненты для отображения результатов остаются без изменений
  const QualityScore = ({ score }) => {
    const percentage = (score * 100).toFixed(1);
    let color = "#4CAF50";
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

  const StorageRecommendation = ({ recommendation }) => {
    if (!recommendation) return null;

    return (
      <div className={s.recommendation}>
        <h3>🏆 Рекомендуемое хранилище: {recommendation.primary_storage}</h3>
        <p>{recommendation.reasoning.recommendation}</p>

        <div className={s.storageOptions}>
          <h4>Доступные варианты:</h4>
          {Object.entries(recommendation.storage_options).map(
            ([key, option]) => (
              <div key={key} className={s.storageOption}>
                <strong>{key.toUpperCase()}:</strong>{" "}
                {option.suitable ? "✅ Подходит" : "❌ Не подходит"}
                <ul>
                  {option.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  const DataCharacteristics = ({ data }) => {
    if (!data) return null;

    return (
      <div className={s.characteristics}>
        <h3>📊 Характеристики данных</h3>
        <div className={s.statsGrid}>
          <div className={s.stat}>
            <span className={s.statValue}>{data.row_count}</span>
            <span className={s.statLabel}>строк</span>
          </div>
          <div className={s.stat}>
            <span className={s.statValue}>{data.column_count}</span>
            <span className={s.statLabel}>колонок</span>
          </div>
          <div className={s.stat}>
            <span className={s.statValue}>{data.estimated_size}</span>
            <span className={s.statLabel}>размер</span>
          </div>
        </div>

        <h4>Типы данных:</h4>
        <div className={s.dataTypes}>
          {data.data_types.map((type, index) => (
            <span key={index} className={s.dataType}>
              {type}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const TableSchema = ({ schema }) => {
    if (!schema) return null;

    return (
      <div className={s.schema}>
        <h3>🗃️ Схема таблицы: {schema.table_name}</h3>

        <h4>Поля:</h4>
        <div className={s.fieldsTable}>
          <div className={s.tableHeader}>
            <span>Имя поля</span>
            <span>Тип</span>
            <span>Индексировано</span>
            <span>Обязательное</span>
          </div>
          {schema.fields.map((field, index) => (
            <div key={index} className={s.tableRow}>
              <span className={s.fieldName}>{field.name}</span>
              <span className={s.fieldType}>{field.type}</span>
              <span>{field.indexed ? "✅" : "❌"}</span>
              <span>{field.nullable ? "❌" : "✅"}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DDLMetadata = ({ metadata }) => {
    if (!metadata) return null;

    return (
      <div className={s.ddlMetadata}>
        <h3>⚙️ Рекомендации по БД</h3>

        <div className={s.ddlSystems}>
          <div className={s.ddlSystem}>
            <h4>PostgreSQL</h4>
            <p>
              <strong>Таблица:</strong> {metadata.postgresql.table_name}
            </p>
            <p>
              <strong>Особенности:</strong>
            </p>
            <ul>
              {metadata.postgresql.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className={s.ddlSystem}>
            <h4>ClickHouse</h4>
            <p>
              <strong>Движок:</strong> {metadata.clickhouse.engine}
            </p>
            <p>
              <strong>Особенности:</strong>
            </p>
            <ul>
              {metadata.clickhouse.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className={s.ddlSystem}>
            <h4>HDFS</h4>
            <p>
              <strong>Формат:</strong> {metadata.hdfs.format}
            </p>
            <p>
              <strong>Путь:</strong> {metadata.hdfs.path}
            </p>
            <p>
              <strong>Особенности:</strong>
            </p>
            <ul>
              {metadata.hdfs.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={s.app}>
      <div className={s.block}>
        {/* Заголовок */}
        <h1 className={s.title}>Анализатор CSV файлов</h1>

        {/* Кнопка сброса (показываем только когда есть результаты) */}
        {analysisResults && (
          <button className={s.resetButton} onClick={resetAnalysis}>
            🗑️ Новый анализ
          </button>
        )}

        {/* Выбор файла */}
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".csv"
        />
        <label htmlFor="fileInput" className={s.file}>
          <img className={s.img} src={file} alt="Выбрать файл" />
        </label>
        <p className={s.descript}>
          {selectedFile ? selectedFile.name : "Выберите CSV файл"}
        </p>

        {/* Кнопки управления */}
        <div className={s.buttons}>
          <button
            className={s.analysis}
            onClick={handleUpload}
            disabled={loading || !selectedFile}
          >
            {loading ? "Загрузка..." : "📤 Загрузить файл"}
          </button>

          <button
            className={s.analysis}
            onClick={startAnalysis}
            disabled={loading || !storagePath}
          >
            🔍 Запустить анализ
          </button>

          <button
            className={s.analysis}
            onClick={checkAnalysisStatus}
            disabled={loading || !analysisId}
          >
            📊 Проверить статус
          </button>
        </div>

        {/* Статус сообщения */}
        {statusMessage && (
          <div className={s.statusMessage}>{statusMessage}</div>
        )}

        {/* Результаты анализа */}
        {analysisResults && analysisResults.status === "completed" && (
          <div className={s.results}>
            {/* Табы для навигации */}
            <div className={s.tabs}>
              <button
                className={activeTab === "overview" ? s.activeTab : s.tab}
                onClick={() => setActiveTab("overview")}
              >
                Обзор
              </button>
              <button
                className={activeTab === "schema" ? s.activeTab : s.tab}
                onClick={() => setActiveTab("schema")}
              >
                Схема данных
              </button>
              <button
                className={activeTab === "storage" ? s.activeTab : s.tab}
                onClick={() => setActiveTab("storage")}
              >
                Хранилища
              </button>
              <button
                className={activeTab === "ddl" ? s.activeTab : s.tab}
                onClick={() => setActiveTab("ddl")}
              >
                DDL
              </button>
            </div>

            {/* Контент табов */}
            <div className={s.tabContent}>
              {activeTab === "overview" && (
                <>
                  <QualityScore
                    score={analysisResults.result.data_quality_score}
                  />
                  <DataCharacteristics
                    data={
                      analysisResults.result.ddl_metadata.data_characteristics
                    }
                  />
                  <StorageRecommendation
                    recommendation={
                      analysisResults.result.storage_recommendation
                    }
                  />

                  <div className={s.recommendations}>
                    <h3>💡 Рекомендации</h3>
                    <ul>
                      {analysisResults.result.recommendations.map(
                        (rec, index) => (
                          <li key={index}>{rec}</li>
                        )
                      )}
                    </ul>
                  </div>
                </>
              )}

              {activeTab === "schema" && (
                <TableSchema schema={analysisResults.result.table_schema} />
              )}

              {activeTab === "storage" && (
                <StorageRecommendation
                  recommendation={analysisResults.result.storage_recommendation}
                />
              )}

              {activeTab === "ddl" && (
                <DDLMetadata
                  metadata={analysisResults.result.ddl_metadata.ddl_generation}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
