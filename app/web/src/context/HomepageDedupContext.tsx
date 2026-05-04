import { createContext, useContext, useState, useCallback } from "react";

type DedupCtx = {
  registeredIds: Set<string>;
  registerIds: (ids: string[]) => void;
};

const HomepageDedupContext = createContext<DedupCtx>({
  registeredIds: new Set(),
  registerIds: () => {},
});

export const useHomepageDedup = () => useContext(HomepageDedupContext);

export const HomepageDedupProvider = ({ children }: { children: React.ReactNode }) => {
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  const registerIds = useCallback((ids: string[]) => {
    setRegisteredIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  }, []);

  return (
    <HomepageDedupContext.Provider value={{ registeredIds, registerIds }}>
      {children}
    </HomepageDedupContext.Provider>
  );
};
