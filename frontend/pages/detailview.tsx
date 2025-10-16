import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MeatballsMenu from "../components/MeatballsMenu";
import { displayTool, Tool } from "../services/toolService";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function DetailView() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [tool, setTool] = useState<Tool | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load tool using service layer
  useEffect(() => {
    if (!Number.isFinite(id)) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await displayTool(id);
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

        <div className="flex flex-col gap-12 bg-white p-8 rounded-lg w-full border border-green-700">
          <div className="flex justify-end items-end">
            {/* To only show actions if this user owns the tool: isOwner && <MeatballsMenu toolId={tool.id} onDeletedRedirec */}
            <MeatballsMenu toolId={tool.id} onDeletedRedirect="/yourtools" />
          </div>

          <div className="flex gap-8 text-black mb-12 items-center">
            {/* Image */}
            <div className="basis-1/2 items-center justify-center flex ">
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


<div className="basis-1/2 p-4 border border-[#2FA86E] rounded-lg mr-16">
  <div className="grid grid-cols-[12rem_1fr] gap-x-2 gap-y-3 text-xl">
    <div className="justify-self-start text-right whitespace-nowrap">Title:</div>
    <div className="font-bold">{tool.name}</div>

    {tool.user && (
      <>
        <div className="justify-self-start text-right whitespace-nowrap ">Owner:</div>
        <div className="font-bold">{tool.user.name || tool.user.username}</div>
      </>
    )}

    <div className="justify-self-start text-right whitespace-nowrap">Place:</div>
    <div className="font-bold">{tool.location || "-"}</div>

    <div className="justify-self-start text-right whitespace-nowrap">Category:</div>
    <div className="font-bold">{(tool as any).category || "-"}</div>

    <div className="justify-self-start text-right whitespace-nowrap">Price:</div>
    <div className="font-bold">{tool.price != null ? `${tool.price} SEK per day` : "-"}</div>

    <div className="justify-self-start text-right whitespace-nowrap">Description:</div>
    <div className="font-bold">{tool.description || "-"}</div>
  </div>
</div>


          </div>
        </div>
      </div>
    </div>
  );
}


