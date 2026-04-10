import { useReducer, createContext, useContext } from "react";

export type Sides = "single" | "double";

export interface AllSettings {
  copies: number;
  sides: Sides;
}

export interface FileData {
  id: string;
  name: string;
  pages: number;
  overrides: {
    copies: number | null;
    sides: Sides | null;
  };
}

export interface AppState {
  allSettings: AllSettings;
  files: FileData[];
  activeTab: "all" | "files";
  selectedFileId: string | null;
}

export type Action =
  | { type: "SET_TAB"; tab: "all" | "files" }
  | { type: "SELECT_FILE"; payload: string }
  | { type: "SET_ALL_COPIES"; payload: number }
  | { type: "SET_ALL_SIDES"; payload: Sides }
  | { type: "SET_FILE_COPIES"; payload: { fileId: string; copies: number | null } }
  | { type: "SET_FILE_SIDES"; payload: { fileId: string; sides: Sides | null } };

export const INITIAL_STATE: AppState = {
  allSettings: { copies: 1, sides: "single" },
  files: [
    { id: "file-A", name: "File A", pages: 1, overrides: { copies: null, sides: null } },
    { id: "file-B", name: "File B", pages: 3, overrides: { copies: null, sides: null } },
    { id: "file-C", name: "File C", pages: 1, overrides: { copies: null, sides: null } },
  ],
  activeTab: "all",
  selectedFileId: "file-A",
};

export function canUseDuplex(pages: number, copies: number): boolean {
  return pages * copies >= 2;
}

export function getEffectiveSettings(file: FileData, allSettings: AllSettings) {
  return {
    copies: file.overrides.copies ?? allSettings.copies,
    sides: file.overrides.sides ?? allSettings.sides,
  };
}

export function printReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.tab };
    case "SELECT_FILE":
      return { ...state, selectedFileId: action.payload, activeTab: "files" };
    case "SET_ALL_COPIES":
      return {
        ...state,
        allSettings: { ...state.allSettings, copies: action.payload },
      };
    case "SET_ALL_SIDES":
      return {
        ...state,
        allSettings: { ...state.allSettings, sides: action.payload },
      };
    case "SET_FILE_COPIES":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.fileId
            ? { ...file, overrides: { ...file.overrides, copies: action.payload.copies } }
            : file
        ),
      };
    case "SET_FILE_SIDES":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.fileId
            ? { ...file, overrides: { ...file.overrides, sides: action.payload.sides } }
            : file
        ),
      };
    default:
      return state;
  }
}

const PrintContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function usePrintContext() {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error("usePrintContext must be used within a PrintProvider");
  }
  return context;
}

export function PrintProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(printReducer, INITIAL_STATE);
  return (
    <PrintContext.Provider value={{ state, dispatch }}>
      {children}
    </PrintContext.Provider>
  );
}
