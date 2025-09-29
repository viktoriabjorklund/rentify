import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { Tool } from "../services/toolService";

const apiBase = "http://localhost:8080/api/";

export default function DashboardPage() {
  const router = useRouter();
  const { token, isAuthenticated, logout, isLoading } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [error, setError] = useState("");
  const [newToolName, setNewToolName] = useState("");
  const [newToolPrice, setNewToolPrice] = useState("");
  const [newToolLocation, setNewToolLocation] = useState("");

  useEffect(() => {
    // Don't redirect while auth state is still loading
    if (isLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (token) {
      fetchTools();
    }
  }, [token, isAuthenticated, isLoading, router]);

  async function fetchTools() {
    if (!token) return;

    const res = await fetch(apiBase + "tools", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Error fetching tools:", data);
      return;
    }

    setTools(data);
  }


  async function addTool(name: string, price: number, location: string) {
    if (!name || !price || !location) {
      setError("All fields required (name, price, location)");
      return;
    }
    
    try {
      const response = await fetch(apiBase + "tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, price: Number(price), location }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create tool");
      }
      
      fetchTools();
      setError(""); // Clear any previous errors
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function updateTool(id: number, description: string) {
    await fetch(apiBase + "tools/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    });
    fetchTools();
  }

  async function deleteTool(id: number) {
    await fetch(apiBase + "tools/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTools();
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>You have {tools.length} tools</h1>

      {tools.map((tool) => (
        <div
          key={tool.id}
          style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}
        >
          <h4>{tool.name}</h4>
          <p>Price: {tool.price}kr/day</p>
          <p>Location: {tool.location}</p>
          <p>Owner: {tool.user.username}</p>
          <input
            placeholder="Description..."
            value={tool.description}
            onChange={(e) => updateTool(tool.id, e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <button onClick={() => deleteTool(tool.id)}>Delete</button>
        </div>
      ))}

      <button onClick={logout}>Logout</button>

      <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
        <h3>Add new tool</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <input
            placeholder="Tool name"
            value={newToolName}
            onChange={(e) => setNewToolName(e.target.value)}
          />
          <input
            placeholder="Price per day (kr)"
            type="number"
            value={newToolPrice}
            onChange={(e) => setNewToolPrice(e.target.value)}
          />
          <input
            placeholder="Location"
            value={newToolLocation}
            onChange={(e) => setNewToolLocation(e.target.value)}
          />
          <button
            onClick={() => {
              addTool(newToolName, Number(newToolPrice), newToolLocation);
              setNewToolName("");
              setNewToolPrice("");
              setNewToolLocation("");
            }}
            disabled={!newToolName || !newToolPrice || !newToolLocation}
          >
            Add tool
          </button>
        </div>
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      </div>
    </div>
  );
}
