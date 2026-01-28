// Simple global state for tab bar visibility
let isTabBarVisible = true;
let listeners = [];

export const hideTabBar = () => {
  console.log('hideTabBar called');
  isTabBarVisible = false;
  listeners.forEach(listener => listener(false));
};

export const showTabBar = () => {
  console.log('showTabBar called');
  isTabBarVisible = true;
  listeners.forEach(listener => listener(true));
};

export const getTabBarVisibility = () => isTabBarVisible;

export const subscribeToTabBarVisibility = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};