"use client";

import React from "react";
import { usePrintContext, canUseDuplex, getEffectiveSettings } from "../hooks/usePrintState";

export default function ConfigPanel() {
  const { state, dispatch } = usePrintContext();
  const { allSettings, files, activeTab, selectedFileId } = state;

  const isAll = activeTab === "all";
  const selectedFile = files.find((f) => f.id === selectedFileId) || files[0];
  
  if (isAll) {
    return (
      <div className="controls">
        <h3 className="card-title">All Settings</h3>
        <p className="mb-2 text-muted">These settings apply to All unless overridden for specific files.</p>
        
        <div className="control-group">
          <div className="control-label">Copies</div>
          <div className="number-input-wrap">
            <button 
              className="number-btn" 
              onClick={() => dispatch({ type: "SET_ALL_COPIES", payload: Math.max(1, allSettings.copies - 1) })}
            >
              -
            </button>
            <input 
              type="number" 
              className="number-input"
              value={allSettings.copies}
              onChange={(e) => dispatch({ type: "SET_ALL_COPIES", payload: Math.max(1, parseInt(e.target.value) || 1) })}
              min={1}
            />
            <button 
              className="number-btn" 
              onClick={() => dispatch({ type: "SET_ALL_COPIES", payload: allSettings.copies + 1 })}
            >
              +
            </button>
          </div>
        </div>

        <div className="control-group">
          <div className="control-label">Sides</div>
          <div className="segmented-control">
            <button 
              className={`segment-btn ${allSettings.sides === "single" ? "active" : ""}`}
              onClick={() => dispatch({ type: "SET_ALL_SIDES", payload: "single" })}
            >
              Single
            </button>
            <button 
              className={`segment-btn ${allSettings.sides === "double" ? "active" : ""}`}
              onClick={() => dispatch({ type: "SET_ALL_SIDES", payload: "double" })}
            >
              Double
            </button>
          </div>
        </div>
      </div>
    );
  }

  // File-specific overrides (Files)
  const isCopiesOverridden = selectedFile.overrides.copies !== null;
  const isSidesOverridden = selectedFile.overrides.sides !== null;
  
  const effectiveSettings = getEffectiveSettings(selectedFile, allSettings);
  
  const handleCopiesChange = (val: number) => {
    dispatch({ type: "SET_FILE_COPIES", payload: { fileId: selectedFile.id, copies: val } });
  };
  
  return (
    <div className="controls">
      <h3 className="card-title mt-2">Files Overrides</h3>
      <p className="mb-2 text-muted">Override settings for <strong style={{color:"white"}}>{selectedFile.name}</strong>.</p>

      <div className="control-group">
        <div className="control-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Copies {isCopiesOverridden && <span className="override-indicator"></span>}
          </span>
          {isCopiesOverridden && (
             <button 
               className="text-muted" 
               style={{background: 'none', border:'none', fontStyle: 'italic', cursor:'pointer', fontSize: '0.8rem', textDecoration: 'underline'}}
               onClick={() => dispatch({ type: "SET_FILE_COPIES", payload: { fileId: selectedFile.id, copies: null }})}
             >
               Clear Match All
             </button>
          )}
        </div>
        <div className="number-input-wrap">
          <button 
            className="number-btn" 
            onClick={() => handleCopiesChange(Math.max(1, effectiveSettings.copies - 1))}
          >
            -
          </button>
          <input 
            type="number" 
            className="number-input"
            value={effectiveSettings.copies}
            onChange={(e) => handleCopiesChange(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
          />
          <button 
            className="number-btn" 
            onClick={() => handleCopiesChange(effectiveSettings.copies + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="control-group">
        <div className="control-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Sides {isSidesOverridden && <span className="override-indicator"></span>}
          </span>
          {isSidesOverridden && (
             <button 
               className="text-muted" 
               style={{background: 'none', border:'none', fontStyle: 'italic', cursor:'pointer', fontSize: '0.8rem', textDecoration: 'underline'}}
               onClick={() => dispatch({ type: "SET_FILE_SIDES", payload: { fileId: selectedFile.id, sides: null }})}
             >
               Clear Match All
             </button>
          )}
        </div>
        <div className="segmented-control">
          <button 
            className={`segment-btn ${effectiveSettings.sides === "single" ? "active" : ""}`}
            onClick={() => dispatch({ type: "SET_FILE_SIDES", payload: { fileId: selectedFile.id, sides: "single" } })}
          >
            Single
          </button>
          <button 
            className={`segment-btn ${effectiveSettings.sides === "double" ? "active" : ""}`}
            onClick={() => dispatch({ type: "SET_FILE_SIDES", payload: { fileId: selectedFile.id, sides: "double" } })}
          >
            Double
          </button>
        </div>
      </div>
      
      {effectiveSettings.sides === "double" && !canUseDuplex(selectedFile.pages, effectiveSettings.copies) && (
        <div className="validation-error">
          <strong>⚠ Insufficient pages.</strong>
          <br/>
          <span style={{ fontSize: '0.85rem' }}>Add more pages or increase copies to enable Double Sided printing.</span>
        </div>
      )}
    </div>
  );
}
