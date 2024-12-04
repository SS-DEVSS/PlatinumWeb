import { createContext, useContext, useState } from "react";

type ItemContextType = {
  type: "kit" | "single" | "";
  setType: React.Dispatch<React.SetStateAction<"kit" | "single" | "">>;
};

const ItemContext = createContext<ItemContextType>({} as ItemContextType);

export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error(
      "useItemContext must be used within an ItemContextProvider"
    );
  }
  return context;
};

export const ItemContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [type, setType] = useState<"kit" | "single" | "">("");
  return (
    <ItemContext.Provider value={{ type, setType }}>
      {children}
    </ItemContext.Provider>
  );
};
