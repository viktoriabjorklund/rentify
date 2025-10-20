import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Dialog, DialogButton, DialogButtonGroup } from "./Dialog";

type Props = {
  toolId: number;
  onDeletedRedirect?: string; // optional: where to go after delete (default /yourtools)
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function MeatballsMenu({ toolId, onDeletedRedirect }: Props) {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    setOpen(false);
    router.push(`/editad?id=${toolId}`);
  };

  const handleDeleteClick = () => {
    setOpen(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const res = await fetch(`${API_BASE}/api/tools/${toolId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to delete (status ${res.status})`);
      }

      // go back to your tools (or a custom redirect)
      router.push(onDeletedRedirect ?? "/yourtools");
    } catch (e: any) {
      alert(e?.message || "Failed to delete");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        aria-label="More actions"
        className="px-2 py-1 text-2xl leading-none rounded hover:bg-gray-100"
        onClick={() => setOpen((v) => !v)}
      >
        ⋯
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Ad"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this ad? This action cannot be undone.
        </p>
        <DialogButtonGroup>
          <DialogButton onClick={handleDeleteCancel} variant="secondary">
            Cancel
          </DialogButton>
          <DialogButton onClick={handleDeleteConfirm} variant="danger">
            Delete
          </DialogButton>
        </DialogButtonGroup>
      </Dialog>
    </div>
  );
}
