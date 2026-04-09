import { createContext, useContext, useState } from "react";

const EyeContext = createContext();

export function EyeProvider({ children }) {
  const [seconds, setSeconds] = useState(0);

  return (
    <EyeContext.Provider value={{ seconds, setSeconds }}>
      {children}
    </EyeContext.Provider>
  );
}

export function useEyeContext() {
  return useContext(EyeContext);
}