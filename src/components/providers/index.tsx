"use client"
import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { Provider } from "react-redux";
import store from "../redux/store";
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
        <Provider store={store}>
          <AuthProvider>{children}</AuthProvider>
        </Provider>
      </ThemeProvider>
    </div>
  );
}
