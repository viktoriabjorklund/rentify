import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import { Tool, getUserTools, createTool, updateTool, deleteTool } from "../services/toolService";

export default function DashboardPage() {
  const router = useRouter();
  const { token, isAuthenticated, logout, isLoading } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    try {
      setLoading(true);
      console.log("Fetching user tools...");
      const userTools = await getUserTools();
      console.log("User tools received:", userTools);
      setTools(userTools);
    } catch (error) {
      console.error("Error fetching user tools:", error);
      setError("Failed to fetch tools");
    } finally {
      setLoading(false);
    }
  }


  async function addTool(name: string, price: number, location: string) {
    if (!name || !price || !location) {
      setError("All fields required (name, price, location)");
      return;
    }
    
    try {
      await createTool({ name, price: Number(price), location });
      fetchTools();
      setError(""); // Clear any previous errors
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function updateToolDescription(id: number, description: string) {
    try {
      await updateTool(id, description);
      fetchTools();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update tool');
    }
  }

  async function deleteToolHandler(id: number) {
    try {
      await deleteTool(id);
      fetchTools();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete tool');
    }
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

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: "2rem auto" }}>
        <p>Loading your tools...</p>
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
          <p>Owner: {tool.user?.username || 'Unknown'}</p>
          <input
            placeholder="Description..."
            value={tool.description}
            onChange={(e) => updateToolDescription(tool.id, e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <button onClick={() => deleteToolHandler(tool.id)}>Delete</button>
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
