"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function useSupabase(): SupabaseClient {
  const client = useContext(SupabaseContext);
  if (!client) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return client;
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    async function initClient() {
      const token = await getToken({ template: "supabase" });
      const client = createClerkSupabaseClient(token);
      setSupabase(client);
    }
    initClient();
  }, [getToken]);

  if (!supabase) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
