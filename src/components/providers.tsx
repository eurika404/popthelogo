"use client";

import { Toaster } from "sonner";
import { CheckCircle2, XCircle, Info } from "lucide-react";

/** Client providers: toast notifications (sonner). */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors={false}
        toastOptions={{
          classNames: {
            toast:
              "rounded-xl border border-line bg-white text-ink shadow-lg px-4 py-3",
            description: "text-muted",
          },
        }}
        icons={{
          success: <CheckCircle2 className="h-4 w-4 text-success" />,
          error: <XCircle className="h-4 w-4 text-danger" />,
          info: <Info className="h-4 w-4 text-brand" />,
        }}
      />
    </>
  );
}
