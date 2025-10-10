import { useEffect, useState } from "react";
import * as React from "react";
import { useRouter } from "next/router";

type Tool = {
  id: number;
  name: string;
  description: string;
  price: number | null;
  location: string | null;
  photoURL?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Map backend/free-text to select values
const normalizePlace = (loc?: string | null) => {
  const v = (loc || "").toLowerCase();
  if (v === "stockholm") return "stockholm";
  if (v === "gothenburg") return "gothenburg";
  if (v === "malmö" || v === "malmo") return "malmo";
  if (v === "") return "";
  return "other";
};

export default function EditAd() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [tool, setTool] = useState<Tool | null>(null);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load tool by id
  useEffect(() => {
    if (!Number.isFinite(id)) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          throw new Error("You must be logged in to edit an ad.");
        }
        const res = await fetch(`${API_BASE}/api/tools/${id}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to load tool (status ${res.status})`);
        }
        const t: Tool = await res.json();
        setTool(t);
        setTitle(t.name || "");
        setPlace(normalizePlace(t.location)); // <-- set from existing value
        setPrice(t.price != null ? String(t.price) : "");
        setDescription(t.description || "");
        if (t.photoURL) {
          setPreview(`${API_BASE}${t.photoURL.startsWith("/") ? "" : "/"}${t.photoURL}`);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load tool");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Handle image select + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Save (PUT multipart)
  const onSave = async () => {
    if (!Number.isFinite(id)) return;
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to edit an ad.");

      const form = new FormData();
      form.append("name", title);
      form.append("description", description);
      form.append("price", price);      // '' is fine
      form.append("location", place);   // <-- send the select value
      if (selectedFile) form.append("photo", selectedFile); // field must be "photo"

      const url = `${API_BASE}/api/tools/${id}`;
      console.log("Sending PUT to:", url);

      const res = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }, // do NOT set Content-Type
        body: form,
      });

      const bodyText = await res.text();
      console.log("PUT status:", res.status);
      console.log("PUT response body:", bodyText);

      if (!res.ok) throw new Error(bodyText || `Failed: ${res.status}`);

      router.push(`/detailview?id=${id}`);
    } catch (e: any) {
      console.error("PUT error:", e);
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!Number.isFinite(id)) {
    return <div className="p-6 text-red-600">Missing or invalid id in query string.</div>;
  }
  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!tool) return <div className="p-6">Not found.</div>;

  return (
    <div className="flex min-h-screen items-center justify-center text-black bg-gray-100">
      <div className="flex flex-col items-center justify-center w-3/4 gap-8">
        <p className="text-4xl text-[#3A7858]">Edit “{tool.name}”</p>

        <div className="flex flex-col gap-12 bg-white p-8 rounded-lg w-full">
          <div className="flex gap-8">
            {/* Image */}
            <div className="basis-1/2 items-center justify-center flex">
              <label className="cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-84 h-64 object-cover border border-black rounded-lg"
                  />
                ) : (
                  <div className="w-84 h-64 flex items-center justify-center border-2 border-dashed border-black rounded-lg bg-gray-50 hover:bg-gray-100">
                    <p>Click to upload new image</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Form */}
            <div className="basis-1/2 flex flex-col gap-4 p-4">
              <div className="flex gap-2">
                <p>Title:</p>
                <input
                  type="text"
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <p>Place:</p>
                <select
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                >
                  <option value=""></option>
                  <option value="stockholm">Stockholm</option>
                  <option value="gothenburg">Gothenburg</option>
                  <option value="malmo">Malmö</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2">
                <p>Price:</p>
                <input
                  type="text"  // <-- plain text input
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <p>SEK per day</p>
              </div>

              <div className="flex flex-col gap-2">
                <p>Description:</p>
                <textarea
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              className="border rounded-lg px-4 py-2 bg-gray-300 text-white cursor-pointer"
              onClick={() => router.push(`/detailview?id=${id}`)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="border rounded-lg px-4 py-2 bg-blue-600 text-white disabled:opacity-60 cursor-pointer"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

