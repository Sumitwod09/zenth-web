"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import { useSupabase } from "@/components/SupabaseProvider";
import { useSettingsStore } from "@/store/settingsStore";
import { useTaskStore } from "@/store/taskStore";
import { useDumpStore } from "@/store/dumpStore";
import { timer } from "@zenth/utils";
import { Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { userId } = useAuth();
  const supabase = useSupabase();
  const { focusDuration, isLoading, loadSettings, updateFocusDuration } = useSettingsStore();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (userId) {
      loadSettings(supabase, userId);
    }
  }, [supabase, userId, loadSettings]);

  function handleDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!userId) return;
    const value = parseInt(e.target.value, 10);
    updateFocusDuration(supabase, value, userId);
  }

  async function handleDeleteAll() {
    if (!userId) return;

    // Delete all tasks
    await supabase.from("tasks").delete().neq("id", "");
    // Delete all dumps
    await supabase.from("dumps").delete().neq("id", "");
    // Reset local stores
    useTaskStore.setState({ tasks: [] });
    useDumpStore.setState({ dumps: [] });

    setShowConfirm(false);
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your focus experience.</p>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Focus Timer</h3>
        <div className="settings-row">
          <div>
            <p className="settings-row-label">Focus duration</p>
            <p className="settings-row-description">
              How long each focus session lasts ({timer.minDuration}–{timer.maxDuration} min)
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <input
              type="range"
              className="settings-slider"
              min={timer.minDuration}
              max={timer.maxDuration}
              step={timer.stepDuration}
              value={focusDuration}
              onChange={handleDurationChange}
              disabled={isLoading}
              id="focus-duration-slider"
            />
            <span className="settings-value">{focusDuration}m</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Danger Zone</h3>
        <div className="settings-row">
          <div>
            <p className="settings-row-label">Delete all data</p>
            <p className="settings-row-description">
              Permanently delete all your dumps and tasks. This cannot be undone.
            </p>
          </div>
          {showConfirm ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="danger-btn"
                onClick={handleDeleteAll}
              >
                Yes, delete everything
              </button>
              <button
                className="focus-btn skip"
                onClick={() => setShowConfirm(false)}
                style={{ padding: "10px 20px", fontSize: "13px" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="danger-btn"
              onClick={() => setShowConfirm(true)}
              id="btn-delete-all"
            >
              <Trash2 size={14} />
              Delete All
            </button>
          )}
        </div>
      </div>
    </>
  );
}
