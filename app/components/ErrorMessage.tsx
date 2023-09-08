import type { ReactNode } from 'react';

export const ErrorMessage = ({ children }: { children: ReactNode }) => {
  return <p className="text-red-500 text-sm">{children}</p>;
};
