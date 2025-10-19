import React from 'react';
import s from "../../App.module.css";

const DDLScripts = ({ ddlData }) => {
  if (!ddlData || !ddlData.ddl_scripts) return null;

  return (
    <div className={s.ddlScripts}>
      <h3>DDL Скрипты</h3>
      {ddlData.ddl_scripts.map((script, index) => (
        <div key={index} className={s.scriptBlock}>
          <h4>{script.type}: {script.name}</h4>
          <pre className={s.codeBlock}>{script.script}</pre>
        </div>
      ))}
    </div>
  );
};

export default DDLScripts;