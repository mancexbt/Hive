"use client";

import { Toaster } from "sonner";

export const ClientToaster = () => {
  return (
    <Toaster 
      position="bottom-right" 
      richColors 
      theme="dark"
      toastOptions={{
        style: {
          background: '#0A0A0A',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
        },
      }}
    />
  );
};
