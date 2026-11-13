"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { setFavourite } from "./actions/favourites-action";


type Ctx = {
  ids: Set<string>;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const FavouritesContext = createContext<Ctx | null>(null);

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx)
    throw new Error("useFavourites must be used inside <FavouritesProvider>");
  return ctx;
}

export function FavouritesProvider({
  initialIds,
  children,
}: {
  initialIds: string[];
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState(() => new Set(initialIds));
  const [open, setOpen] = useState(false);
  

 const apply = useCallback((id: string, saved: boolean) => {
   setIds((prev) => {
     const next = new Set(prev);
     if (saved) next.add(id);
     else next.delete(id);
     return next;
   });
 }, []);

 const toggle = useCallback(
   async (id: string) => {
     const willSave = !ids.has(id);
     apply(id, willSave);
     if (willSave) setOpen(true);
     try {
       await setFavourite(id, willSave);
     } catch {
       apply(id, !willSave);
     }
   },
   [ids, apply],
 );

  const value = useMemo<Ctx>(
    () => ({ ids, isSaved: (id) => ids.has(id), toggle, open, setOpen }),
    [ids, toggle, open],
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}
