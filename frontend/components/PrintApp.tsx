"use client";

import React from "react";
import Tabs from "./Tabs";
import ConfigPanel from "./ConfigPanel";
import FileList from "./FileList";
import { PrintProvider } from "../hooks/usePrintState";

export default function PrintApp() {
  return (
    <PrintProvider>
      <div className="app-container">
        <header className="header">
          <h1>PrintEasy</h1>
          <p>Advanced Print Configuration Dashboard</p>
        </header>

        <main className="dashboard">
          <section className="dashboard-main">
            <FileList />
          </section>

          <aside className="dashboard-sidebar">
            <div className="card">
              <Tabs />
              <ConfigPanel />
            </div>
          </aside>
        </main>
      </div>
    </PrintProvider>
  );
}
