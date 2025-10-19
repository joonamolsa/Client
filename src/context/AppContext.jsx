// hallitsee sovelluksen näkymää (contacts, companies, yellow) ja jakaa sen kaikille komponenteille Reactin Context API:n avulla.
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [view, setView] = useState("contacts");

  return (
    <AppContext.Provider value={{ view, setView }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
