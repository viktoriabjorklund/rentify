// pages/profile.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import { getUserTools } from "../services/toolService";
import { deleteUser as apiDeleteUser } from "../services/userService";
import DeleteCheck from "@/components/DeleteCheck";
import { Dialog, DialogButton, DialogButtonGroup } from "@/components/Dialog";

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [toolsCount, setToolsCount] = useState<number | null>(null);
  const [toolsErr, setToolsErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // state for the confirmation modal
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);


  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      getUserTools()
        .then((list) => setToolsCount(list.length))
        .catch((err) => {
          console.error(err);
          setToolsErr("Failed to load your tools");
          setToolsCount(0);
        });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-black">
        <p>Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-black">
        <p>Redirecting to login…</p>
      </div>
    );
  }

  const fullName =
    [user.name, user.surname].filter(Boolean).join(" ").trim() || "—";


  const onDeleteClick = () => setConfirmOpen(true);

  // When the user confirms in the modal
  const confirmDelete = async () => {
    if (!user) return;
    try {
      setBusy(true);
      setConfirmOpen(false);
      await apiDeleteUser(user.id);

      setShowDelete(true); 
      setTimeout(() => {
        logout(); 
        router.replace("/login");
      }, 1500);
    } catch (e: any) {
      alert(e?.message || "Failed to delete account");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center text-black">
      <div className="flex flex-col gap-10 justify-center items-center w-1/2 h-3/4 border rounded-lg p-8 bg-white max-[431px]:h-auto">
        <h1 className="text-6xl mb-6 max-[431px]:text-xs max-[431px]:font-semibold max-[431px]:mb-2">
          {fullName}
        </h1>

        <div className="flex flex-col gap-3 text-lg w-1/2 items-center max-[431px]:gap-1">
          <div className="mb-6 max-[431px]:mb-2">
            <span className="max-[431px]:text-xs whitespace-nowrap">
              Account Details
            </span>
          </div>

          <div className="grid grid-cols-[12rem_1fr] gap-x-2 gap-y-3 text-xl max-[431px]:text-[10px] max-[431px]:grid-cols-[4rem_1fr]">
            <div className="justify-self-start text-right whitespace-nowrap">
              Email:
            </div>
            <div className="font-sans">{user.username}</div>

            <div className="justify-self-start text-right whitespace-nowrap">
              Number of ads:
            </div>
            <div className="font-sans">{toolsCount ?? "…"}</div>
          </div>

          {toolsErr && <p className="text-sm text-red-600">{toolsErr}</p>}
        </div>

        <button
          className="border rounded-lg w-48 h-12 bg-red-500 text-white mt-8 disabled:opacity-60 hover:bg-red-600 cursor-pointer max-[431px]:w-24 max-[431px]:text-xs"
          onClick={onDeleteClick}
          disabled={busy}
        >
          {busy ? "Deleting…" : "Delete account"}
        </button>

        {showDelete && (
          <DeleteCheck
            message="Account Deleted!"
            onClose={() => setShowDelete(false)}
          />
        )}
      </div>

      <Dialog
        isOpen={confirmOpen}
        onClose={() => !busy && setConfirmOpen(false)}
        title="Delete account?"
      >
        <p className="text-gray-700">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <DialogButtonGroup>
          <DialogButton onClick={() => setConfirmOpen(false)} disabled={busy}>
            Cancel
          </DialogButton>
          <DialogButton onClick={confirmDelete} disabled={busy}>
            Yes, delete
          </DialogButton>
        </DialogButtonGroup>
      </Dialog>
    </div>
  );
}
