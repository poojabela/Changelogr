import React, { createContext, useState, useContext, useEffect } from "react";

interface SidebarContextValue {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

export const SidebarProvider = ({ children }: any) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSidebarVisible(!event.matches);
    };

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsSidebarVisible(!mediaQuery.matches);
    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  const value: SidebarContextValue = {
    isSidebarVisible,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
