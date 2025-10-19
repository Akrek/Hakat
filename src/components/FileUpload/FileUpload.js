import React from 'react';
import file from "../../file.png";
import s from "../../App.module.css";

const FileUpload = ({ selectedFile, onFileChange, onUpload, loading, isAnalyzing, statusMessage }) => {
  return (
    <>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={onFileChange}
        accept=".csv,.json,.xml"
      />
      <label htmlFor="fileInput" className={s.file}>
        <img className={s.img} src={file} alt="Выбрать файл" />
      </label>
      <p className={s.descript}>
        {selectedFile ? selectedFile.name : "Выберите файл (CSV, JSON, XML)"}
      </p>

      <div className={s.buttons}>
        <button
          className={s.analysis}
          onClick={onUpload}
          disabled={loading || !selectedFile || isAnalyzing}
        >
          {loading ? "Загрузка..." : "Загрузить и проанализировать"}
        </button>
      </div>

      {statusMessage && (
        <div className={s.statusMessage}>{statusMessage}</div>
      )}
    </>
  );
};

export default FileUpload;