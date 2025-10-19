import { http, HttpResponse } from 'msw';

export const handlers = [
  // Мок для загрузки файла
  http.post('http://localhost:8080/api/v1/files/upload', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file');
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return HttpResponse.json({
      file_id: `mock_file_${Date.now()}`,
      message: "Файл успешно загружен",
      file_name: file.name,
      file_size: file.size
    });
  }),

  // Мок для запуска анализа
  http.post('http://localhost:8080/api/v1/analysis/start', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json({
      analysis_id: `mock_analysis_${Date.now()}`,
      pipeline_id: `mock_pipeline_${Date.now()}`,
      status: "started",
      message: "Анализ запущен"
    });
  }),

  // Мок для получения результатов анализа
  http.get('http://localhost:8080/api/v1/analysis/:analysisId/result', async ({ params }) => {
    const { analysisId } = params;
    
    // Имитация длительного процесса анализа
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Генерируем реалистичные мок-данные
    return HttpResponse.json({
      analysis_id: analysisId,
      status: "completed",
      processing_time: 3.5,
      confidence_score: 0.87,
      agents_used: ["DATA_ANALYZER", "DB_SELECTOR", "DDL_GENERATOR", "REPORT_GENERATOR"],
      tools_used: ["pandas", "sqlalchemy", "ai_model"],
      
      data_analysis: {
        data_type: "Транзакционные данные",
        quality_score: 0.92,
        characteristics: {
          volume: "~100,000 записей",
          update_frequency: "Ежедневно",
          complexity: "Средняя"
        },
        structure: {
          key_fields: ["id", "user_id", "transaction_date"],
          partition_fields: ["transaction_date"],
          data_types: {
            id: "integer",
            user_id: "integer", 
            transaction_date: "datetime",
            amount: "decimal",
            category: "varchar"
          }
        }
      },
      
      storage_recommendation: {
        value: "PostgreSQL",
        commentary: "PostgreSQL рекомендуется для OLTP workloads с транзакционными данными. Хорошая поддержка ACID, индексов и сложных запросов.",
        config: {
          partitioning: "По дате транзакции",
          replication: "Асинхронная репликация",
          indexing: "B-tree для часто используемых полей"
        }
      },
      
      ddl_scripts: [
        {
          type: "CREATE_TABLE",
          name: "transactions",
          script: `CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  transaction_date TIMESTAMP NOT NULL,
  amount DECIMAL(10,2),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);`
        },
        {
          type: "CREATE_INDEX", 
          name: "idx_transactions_category",
          script: "CREATE INDEX idx_transactions_category ON transactions(category);"
        }
      ],
      
      optimized_queries: [
        {
          query: "SELECT user_id, SUM(amount) as total_spent FROM transactions WHERE transaction_date >= NOW() - INTERVAL '30 days' GROUP BY user_id HAVING SUM(amount) > 1000;",
          optimization: "Использование индекса по дате и пользователю"
        },
        {
          query: "EXPLAIN ANALYZE SELECT * FROM transactions WHERE category = 'electronics' AND transaction_date BETWEEN '2024-01-01' AND '2024-01-31';",
          optimization: "Составной индекс по категории и дате"
        }
      ],
      
      dag_code: `from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
import pandas as pd
import psycopg2

def load_transactions_data():
    # Загрузка данных в PostgreSQL
    conn = psycopg2.connect(
        host="localhost",
        database="transactions_db",
        user="admin",
        password="password"
    )
    
    df = pd.read_csv('/data/transactions.csv')
    # ... код обработки данных
    
    print("Данные успешно загружены")

default_args = {
    'owner': 'data_engineer',
    'start_date': datetime(2024, 1, 1),
    'retries': 1
}

dag = DAG(
    'transactions_etl',
    default_args=default_args,
    description='ETL пайплайн для транзакционных данных',
    schedule_interval=timedelta(days=1)
)

load_task = PythonOperator(
    task_id='load_transactions',
    python_callable=load_transactions_data,
    dag=dag
)`,
      
      user_report: "Анализ выявил высококачественные транзакционные данные. Рекомендуется использовать PostgreSQL с партиционированием по дате. Созданы оптимальные индексы для типичных запросов. ETL пайплайн настроен для ежедневного обновления.",
      
      errors: [],
      warnings: ["Рекомендуется добавить валидацию данных на этапе ETL"]
    });
  })
];