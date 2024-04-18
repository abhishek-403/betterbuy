import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="blank-theme"
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </div>
  );
}
