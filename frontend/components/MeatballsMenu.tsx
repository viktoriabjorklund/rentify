import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { DeleteConfirmDialog } from "./dialogs/DeleteConfirmDialog";

type Props = {
  toolId: number;
  onDeletedRedirect?: string; // optional: where to go after delete (default /yourtools)
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function MeatballsMenu({ toolId, onDeletedRedirect }: Props) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    setOpen(false);
    router.push(`/editad?id=${toolId}`);
  };

  const handleDelete = () => {
    setOpen(false);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
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
      setDeleteDialogOpen(false);
    }
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
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
        itemName="this ad"
      />
    </div>
  );
}
