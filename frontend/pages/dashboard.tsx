import { useEffect, useState } from "react";

// den här är för att göra de enklare att utveckla. Så man får fel om man skriver tools.hallå eller vad som helst
// kan tas bort
interface Tool {
  id: number;
  name: string;
  description: string;
  user: {
    username: string;
  };
}

const apiBase = "http://localhost:8080/api/";

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistration, setIsRegistration] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (token) {
      fetchTools();
    }
  }, [token]);

  async function fetchTools() {
    if (!token) return;

    const res = await fetch(apiBase + "tools", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("TOOLS API RESPONSE:", data);

    if (!Array.isArray(data)) {
      console.error("Fel vid hämtning av tools:", data);
      return;
    }

    setTools(data);
  }

  async function authenticate() {
    try {
      const res = await fetch(
        apiBase + (isRegistration ? "users/register" : "users/login"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        }
      );
      const data = await res.json();
      console.log("AUTH RESPONSE:", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        throw new Error("Auth failed");
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  async function addTool(name: string) {
    if (!name) return;
    await fetch(apiBase + "tools", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
      body: JSON.stringify({ name }),
    });
    fetchTools();
  }

  async function updateTool(id: number, description: string) {
    await fetch(apiBase + "tools/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
      body: JSON.stringify({ description }),
    });
    fetchTools();
  }

  async function deleteTool(id: number) {
    await fetch(apiBase + "tools/" + id, {
      method: "DELETE",
      headers: { Authorization: token ?? "" },
    });
    fetchTools();
  }

  if (!token) {
    return (
      <section style={{ maxWidth: 400, margin: "2rem auto" }}>
        <h2>{isRegistration ? "Skapa konto" : "Logga in"}</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          type="password"
        />
        <button onClick={authenticate}>
          {isRegistration ? "Registrera" : "Logga in"}
        </button>

        {error && <p>{error}</p>}

        <hr />
        <p style={{ fontSize: "0.9rem" }}>
          {isRegistration ? "Har du redan ett konto?" : "Har du inget konto?"}
        </p>
        <button onClick={() => setIsRegistration(!isRegistration)}>
          {isRegistration ? "Gå till login" : "Skapa konto"}
        </button>
      </section>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Du har {tools.length} verktyg</h1>

      {tools.map((tool) => (
        <div
          key={tool.id}
          style={{ border: "1px solid #ccc", padding: "1rem" }}
        >
          <p>{tool.name}</p>
          <p>Ägare: {tool.user.username}</p>
          <input
            placeholder="Beskrivning..."
            value={tool.description}
            onChange={(e) => updateTool(tool.id, e.target.value)}
          />
          <button onClick={() => deleteTool(tool.id)}>Ta bort</button>
        </div>
      ))}

      <button onClick={logout}>Logga ut</button>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          id="toolInput"
          placeholder="Lägg till nytt verktyg"
          onKeyDown={(e) => {
            if (e.key === "Enter")
              addTool((e.target as HTMLInputElement).value);
          }}
        />
        <button
          onClick={() =>
            addTool(
              (document.getElementById("toolInput") as HTMLInputElement).value
            )
          }
        >
          +
        </button>
      </div>
    </div>
  );
}
