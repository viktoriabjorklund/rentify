import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MeatballsMenu from "../components/MeatballsMenu";

type Tool = {
  id: number;
  name: string;
  description: string;
  price: number | null;
  location: string | null;
  photoURL?: string | null;
  user?: { id: number; username: string; name?: string | null; surname?: string | null };
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function DetailView() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [tool, setTool] = useState<Tool | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${API_BASE}/api/tools/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to fetch tool (status ${res.status})`);
        }
        const data: Tool = await res.json();
        setTool(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load tool");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!Number.isFinite(id)) {
    return <div className="p-6 text-red-600">Missing or invalid id in query string.</div>;
  }
  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!tool) return <div className="p-6">Not found.</div>;

  const imageSrc =
    tool.photoURL
      ? (tool.photoURL.startsWith("http")
          ? tool.photoURL
          : `${API_BASE}${tool.photoURL.startsWith("/") ? "" : "/"}${tool.photoURL}`)
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center text-black bg-gray-100">
      <div className="flex flex-col items-center justify-center w-3/4 gap-8">
        <p className="text-4xl text-[#3A7858]">{tool.name}</p>

        <div className="flex flex-col gap-12 bg-white p-8 rounded-lg w-full pb-24">
          <div className="flex justify-end items-center">
            {/* To only show actions if this user owns the tool: isOwner && <MeatballsMenu toolId={tool.id} onDeletedRedirec */}
            <MeatballsMenu toolId={tool.id} onDeletedRedirect="/yourtools" />
          </div>

          <div className="flex gap-8">
            {/* Image */}
            <div className="basis-1/2 items-center justify-center flex">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={tool.name}
                  className="w-84 h-64 object-cover border border-black rounded-lg"
                />
              ) : (
                <div className="w-84 h-64 flex items-center justify-center border-2 border-dashed border-black rounded-lg bg-gray-50">
                  <p>No image</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="basis-1/2 flex flex-col gap-4 p-4">
              <div className="flex gap-2">
                <p className="font-medium">Title:</p>
                <p>{tool.name}</p>
              </div>

              <div className="flex gap-2">
                <p className="font-medium">Place:</p>
                <p>{tool.location || "-"}</p>
              </div>

              <div className="flex gap-2">
                <p className="font-medium">Price:</p>
                <p>{tool.price != null ? `${tool.price} SEK per day` : "-"}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium">Description:</p>
                <p>{tool.description || "-"}</p>
              </div>

              {tool.user && (
                <div className="flex gap-2">
                  <p className="font-medium">Owner:</p>
                  <p>{tool.user.name || tool.user.username}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


