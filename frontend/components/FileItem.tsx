"use client";

import React from "react";
import { usePrintContext, canUseDuplex, getEffectiveSettings, FileData } from "../hooks/usePrintState";

export default function FileItem({ file }: { file: FileData }) {
  const { state, dispatch } = usePrintContext();
  const { allSettings, selectedFileId } = state;

  const isSelected = file.id === selectedFileId && state.activeTab === "files";
  const effectiveSettings = getEffectiveSettings(file, allSettings);
  
  const hasCopiesOverride = file.overrides.copies !== null;
  const hasSidesOverride = file.overrides.sides !== null;

  const handleSelect = () => {
    dispatch({ type: "SELECT_FILE", payload: file.id });
  };

  const isDuplexInvalid = effectiveSettings.sides === "double" && !canUseDuplex(file.pages, effectiveSettings.copies);

  return (
    <div className={`file-item ${isSelected ? "selected" : ""}`} onClick={handleSelect}>
      <div className="file-header">
        <div className="file-name">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--accent)'}}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          {file.name}
          {(hasCopiesOverride || hasSidesOverride) && (
             <span className="override-indicator" title="Has Files Overrides"></span>
          )}
        </div>
        <div className="file-pages">{file.pages} {file.pages === 1 ? 'page' : 'pages'}</div>
      </div>
      
      <div className="file-settings">
        <div className="setting-pill">
          <span className="text-muted">Copies:</span> 
          <span className="setting-value">{effectiveSettings.copies}</span>
        </div>
        <div className="setting-pill">
          <span className="text-muted">Sides:</span> 
          <span className="setting-value">{effectiveSettings.sides === "single" ? "Single" : "Double"}</span>
        </div>
      </div>

      {isDuplexInvalid && (
        <div className="validation-error" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', marginTop: '0', borderRadius: '6px' }}>
          ⚠ Insufficient pages for double-sided
        </div>
      )}
    </div>
  );
}
