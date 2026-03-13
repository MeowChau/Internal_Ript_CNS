import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

interface AttendanceContextValue {
  isCheckOut: boolean;
  setIsCheckOut: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  hasInitialized: boolean;
  setHasInitialized: (value: boolean) => void;
  resetInitialization: () => void;
}

const AttendanceContext = createContext<AttendanceContextValue | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const resetInitialization = useCallback(() => {
    setHasInitialized(false);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isCheckOut, 
    setIsCheckOut, 
    loading, 
    setLoading, 
    hasInitialized, 
    setHasInitialized,
    resetInitialization 
  }), [isCheckOut, loading, hasInitialized, resetInitialization]);

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendanceContext = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendanceContext must be used within AttendanceProvider');
  }
  return context;
};
