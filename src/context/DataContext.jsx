// Keskitetty CRUD + tila kaikille resursseille (contacts, companies, yellow)
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ContactsAPI, CompaniesAPI, YellowAPI } from "../api";

const DataContext = createContext(null);

const emptySlice = () => ({ items: [], loading: false, error: "" });

export function DataProvider({ children }) {
  // Yhteinen tila kaikille resursseille
  const [state, setState] = useState({
    contacts: emptySlice(),
    companies: emptySlice(),
    yellow: emptySlice(),
  });

  // API-kartta (vakio kehityksessä)
  const api = useMemo(
    () => ({
      contacts: ContactsAPI,
      companies: CompaniesAPI,
      yellow: YellowAPI,
    }),
    []
  );

  // --- apu: varmistetaan että resurssi on olemassa ---
  const ensure = (resource) => {
    if (!api[resource]) throw new Error(`Unknown resource: ${resource}`);
  };

  // --- READ (list) ---
  const load = useCallback(
    async (resource, params = {}) => {
      ensure(resource);
      setState((s) => ({
        ...s,
        [resource]: { ...s[resource], loading: true, error: "" },
      }));
      try {
        const rows = await api[resource].list(params);
        setState((s) => ({
          ...s,
          [resource]: { ...s[resource], loading: false, items: rows },
        }));
      } catch (e) {
        setState((s) => ({
          ...s,
          [resource]: {
            ...s[resource],
            loading: false,
            error: e.response?.data?.error || e.message,
          },
        }));
      }
    },
    [api]
  );

  // --- CREATE ---
  const create = useCallback(
    async (resource, body) => {
      ensure(resource);
      const saved = await api[resource].create(body);
      setState((s) => ({
        ...s,
        [resource]: { ...s[resource], items: [saved, ...s[resource].items] },
      }));
      return saved;
    },
    [api]
  );

  // --- UPDATE ---
  const update = useCallback(
    async (resource, id, body) => {
      ensure(resource);
      const saved = await api[resource].update(id, body);
      setState((s) => ({
        ...s,
        [resource]: {
          ...s[resource],
          items: s[resource].items.map((it) => (it.id === id ? saved : it)),
        },
      }));
      return saved;
    },
    [api]
  );

  // --- DELETE ---
  const remove = useCallback(
    async (resource, id) => {
      ensure(resource);
      await api[resource].remove(id);
      setState((s) => ({
        ...s,
        [resource]: {
          ...s[resource],
          items: s[resource].items.filter((it) => it.id !== id),
        },
      }));
    },
    [api]
  );

  // Pieni valintakoukku näkymille
  const useSlice = useCallback(
    (resource) => {
      ensure(resource);
      return state[resource];
    },
    [state]
  );

  // Contextin arvo
  const value = useMemo(
    () => ({ useSlice, load, create, update, remove }),
    [useSlice, load, create, update, remove]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Näkymien käyttöhookki
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
};
