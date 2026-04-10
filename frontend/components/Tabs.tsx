"use client";

import React from "react";
import { usePrintContext } from "../hooks/usePrintState";

export default function Tabs() {
  const { state, dispatch } = usePrintContext();
  const selectedFile = state.files.find((f) => f.id === state.selectedFileId);

  return (
    <div className="tabs">
      <button
        className={`tab ${state.activeTab === "all" ? "active" : ""}`}
        onClick={() => dispatch({ type: "SET_TAB", tab: "all" })}
      >
        All
      </button>
      <button
        className={`tab ${state.activeTab === "files" ? "active" : ""}`}
        onClick={() => dispatch({ type: "SET_TAB", tab: "files" })}
        disabled={!selectedFile}
      >
        {selectedFile ? `Files (${selectedFile.name})` : "Files"}
      </button>
    </div>
  );
}
