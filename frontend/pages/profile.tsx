// pages/profile.tsx
import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth"; // same import style you used in yourtools
import { getUserTools } from "../services/toolService";

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [toolsCount, setToolsCount] = React.useState<number | null>(null);
  const [toolsErr, setToolsErr] = React.useState<string | null>(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      getUserTools()
        .then(list => setToolsCount(list.length))
        .catch(err => {
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

  return (
    <div className="flex h-screen items-center justify-center text-black">
      <div className="flex flex-col gap-10 justify-center items-center w-1/2 h-3/4 border rounded-lg p-8 bg-white">
        <h1 className="text-6xl mb-6">{user.username}</h1>

        <div className="flex flex-col gap-3 text-lg w-1/2 items-center">
          <div className="mb-6">
            <span className="font-semibold">Account Details</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">ID:</span>
            <span>{user.id}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Name:</span>
            <span>{fullName}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Number of tools:</span>
            <span>{toolsCount ?? "…"}</span>
          </div>

        </div>

        <button
          className="border rounded-lg w-48 h-12 bg-red-500 text-white mt-8"
          onClick={() =>
            alert(
              "Are you sure you want to delete your account? This action cannot be undone."
            )
          }
        >
          Delete account
        </button>
      </div>
    </div>
  );
}

  //profilsida: mejl, username, location, id, name, surname saker som står i user objectet, knapp att kunna ta bort användare