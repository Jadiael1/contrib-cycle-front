import { AuthContext, type TAuthContextProps } from "@/context/AuthContext";
import { useContext } from "react";

export function useAuth(): TAuthContextProps {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}