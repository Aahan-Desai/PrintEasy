"use client";

import React from "react";
import { usePrintContext } from "../hooks/usePrintState";
import FileItem from "./FileItem";

export default function FileList() {
  const { state } = usePrintContext();

  return (
    <div className="card h-full">
      <h2 className="card-title">Document Queue</h2>
      <div className="file-list">
        {state.files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
