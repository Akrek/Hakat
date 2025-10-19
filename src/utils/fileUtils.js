// Определение типа файла по расширению
export const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['csv', 'json', 'xml'].includes(ext)) {
    return ext;
  }
  return ''; // Автоопределение сервером
};

// Обработка результатов анализа
export const processAnalysisResults = (result) => {
  // Исправляем поле commentary если оно повреждено
  const storageRecommendation = result.storage_recommendation;
  let reasoning = storageRecommendation.commentary;
  
  // Если commentary повреждено, используем value или другое поле
  if (!reasoning || reasoning.includes("commentary to=assistant")) {
    reasoning = storageRecommendation.value || "PostgreSQL рекомендуется для OLTP workloads";
  }

  // Преобразуем данные в формат, понятный нашему интерфейсу
  return {
    status: "completed",
    message: "Анализ завершен успешно",
    result: {
      DATA_ANALYZER: {
        status: "success",
        result: result.data_analysis
      },
      DB_SELECTOR: {
        status: "success", 
        result: {
          recommended_storage: storageRecommendation.value,
          reasoning: reasoning,
          config: storageRecommendation.config
        }
      },
      DDL_GENERATOR: {
        status: "success",
        result: {
          ddl_scripts: result.ddl_scripts
        }
      },
      ETL_BUILDER: {
        status: result.dag_code ? "success" : "skipped",
        result: {
          python_code: result.dag_code || "ETL пайплайн не требуется для данного типа данных"
        }
      },
      QUERY_OPTIMIZER: {
        status: "success",
        result: {
          optimizations: result.optimized_queries?.map(q => q.query) || [],
          indexes: result.ddl_scripts?.filter(script => 
            script.script && script.script.includes('CREATE INDEX')
          ).map(script => script.script) || []
        }
      },
      REPORT_GENERATOR: {
        status: result.user_report && result.user_report !== "Отчёт не сгенерирован." ? "success" : "skipped",
        result: {
          summary: result.user_report !== "Отчёт не сгенерирован." ? result.user_report : "Автоматический отчет не был сгенерирован. Смотрите рекомендации ниже.",
          recommendations: [
            `Рекомендуемое хранилище: ${storageRecommendation.value}`,
            `Уверенность анализа: ${(result.confidence_score * 100).toFixed(1)}%`,
            `Тип данных: ${result.data_analysis.data_type}`,
            `Объем: ${result.data_analysis.characteristics.volume}`,
            ...(result.optimized_queries?.slice(0, 3).map(q => q.query) || [])
          ],
          next_steps: [
            "Настройте PostgreSQL базу данных",
            "Выполните предоставленные DDL скрипты для создания таблиц",
            "Внедрите предложенные оптимизации запросов",
            "Настройте ежедневное обновление данных"
          ]
        }
      }
    },
    metadata: {
      processing_time: result.processing_time,
      agents_used: result.agents_used,
      tools_used: result.tools_used,
      confidence_score: result.confidence_score,
      errors: result.errors,
      warnings: result.warnings
    }
  };
};