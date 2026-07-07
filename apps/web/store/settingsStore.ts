import { create } from "zustand";
import { SupabaseClient } from "@supabase/supabase-js";
import { timer } from "@zenth/utils";

interface SettingsState {
  focusDuration: number; // minutes
  isLoading: boolean;
  loadSettings: (supabase: SupabaseClient, userId: string) => Promise<void>;
  updateFocusDuration: (supabase: SupabaseClient, minutes: number, userId: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  focusDuration: timer.defaultDuration,
  isLoading: false,

  loadSettings: async (supabase, userId) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found (first time user)
      console.error("Failed to load settings:", error);
    }

    if (data) {
      set({ focusDuration: data.focus_duration_minutes });
    }
    set({ isLoading: false });
  },

  updateFocusDuration: async (supabase, minutes, userId) => {
    const clamped = Math.min(
      timer.maxDuration,
      Math.max(timer.minDuration, minutes)
    );

    // Optimistic
    set({ focusDuration: clamped });

    const { error } = await supabase.from("settings").upsert(
      {
        user_id: userId,
        focus_duration_minutes: clamped,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Failed to save settings:", error);
    }
  },
}));
