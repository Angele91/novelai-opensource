import { createContext, useContext, useMemo, useState } from "react";

const LorebookContext = createContext({
  entries: [],
  onEntriesChange: () => { },
  selectedEntryId: null,
  setSelectedEntryId: () => { },
});

export const useLorebook = () => {
  const context = useContext(LorebookContext);

  if (!context) {
    throw new Error(
      `useLorebook must be used within a LorebookProvider`
    );
  }

  return context;
};

export const LorebookProvider = ({
  children,
  entries,
  onEntriesChange
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState(null)

  const contextValues = useMemo(() => ({
    entries: (entries ?? []).map(entry => ({ ...entry, parent: entry.parent ?? 0 })),
    onEntriesChange,
    selectedEntryId,
    setSelectedEntryId,
  }), [entries, onEntriesChange, selectedEntryId])

  return (
    <LorebookContext.Provider
      value={contextValues}
    >
      {children}
    </LorebookContext.Provider>
  );
};

export default LorebookContext;