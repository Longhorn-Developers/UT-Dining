import React from 'react';

import { useVersionCheck } from '~/hooks/useVersionCheck';

interface VersionCheckProviderProps {
  children: React.ReactNode;
}

export const VersionCheckProvider: React.FC<VersionCheckProviderProps> = ({ children }) => {
  useVersionCheck();
  return <>{children}</>;
};
