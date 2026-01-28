import React, { createContext, useContext, useState } from 'react';

interface TabBarContextType {
  isTabBarVisible: boolean;
  hideTabBar: () => void;
  showTabBar: () => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const hideTabBar = () => {
    console.log('TabBarProvider - HIDING TAB BAR');
    setIsTabBarVisible(false);
  };
  
  const showTabBar = () => {
    console.log('TabBarProvider - SHOWING TAB BAR');
    setIsTabBarVisible(true);
  };

  console.log('TabBarProvider - Current state:', isTabBarVisible);

  return (
    <TabBarContext.Provider value={{ isTabBarVisible, hideTabBar, showTabBar }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (context === undefined) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
};