const API_BASE_URL = "http://localhost:8080/api/v1";

export const apiService = {
  // Загрузка файла
  async uploadFile(file, fileType, userId = "default_user", targetDb = "postgres") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);
    formData.append("user_id", userId);
    formData.append("target_db", targetDb);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Запуск анализа
  async startAnalysis(fileId, fileName) {
    const requestBody = {
      file_id: fileId,
      file_name: fileName
    };

    const response = await fetch(`${API_BASE_URL}/analysis/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Получение результатов анализа
  async getAnalysisResults(analysisId) {
    const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}/result`, {
      method: "GET",
    });

    if (!response.ok && response.status !== 202) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }
};