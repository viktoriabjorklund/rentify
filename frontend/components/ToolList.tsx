import React from "react";
import Link from "next/link";
import { Tool } from "../services/toolService";
import { useAuth } from "../hooks/auth"; // <- you already use this elsewhere

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type ToolListProps = {
  tools: Tool[];
  showUser?: boolean;
  showDescription?: boolean;
  className?: string;
};

type ToolCardProps = {
  tool: Tool;
  showUser?: boolean;
  showDescription?: boolean;
};

function ToolCard({ tool, showUser = false, showDescription = false }: ToolCardProps) {
  const imgSrc = tool.photoURL
    ? (tool.photoURL.startsWith("http")
        ? tool.photoURL
        : `${API_BASE}${tool.photoURL.startsWith("/") ? "" : "/"}${tool.photoURL}`)
    : null;

  return (
    <article className="transition hover:opacity-80 cursor-pointer rounded-2xl overflow-hidden">
      <div className="aspect-[16/10] w-full bg-gray-200">
        {imgSrc ? (
          <img src={imgSrc} alt={tool.name} className="object-cover w-full h-full" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="pt-2 px-2">
        <h3 className="text-lg font-bold text-emerald-900 mb-2">{tool.name}</h3>
        <p className="text-gray-800 mb-2">
          {tool.location} – {tool.price}kr/day
        </p>
        {showDescription && tool.description && (
          <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
        )}
        {showUser && tool.user && (
          <p className="text-xs text-gray-500">By: {tool.user.username}</p>
        )}
      </div>
    </article>
  );
}

export default function ToolList({
  tools,
  showUser = false,
  showDescription = false,
  className = "",
}: ToolListProps) {
  const { user } = useAuth(); // current logged-in user (or undefined if not logged in)

  if (tools.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No tools available</p>
      </div>
    );
  }

  return (
    <section
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
      aria-label="Tools"
    >
      {tools.map((tool) => {
        const ownerId = tool.user?.id ?? (tool as any).userId; // fallback if user object not included
        const isOwner = !!user && ownerId === user.id;

        // If it's the user's own tool -> /detailview?id=ID
        // Else -> "/ID" (your public/other-user view)
        const href = isOwner
          ? { pathname: "/detailview", query: { id: tool.id } }
          : `/${tool.id}`;

        return (
          <Link
            key={tool.id}
            href={href}
            className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 hover:shadow-md transition"
            aria-label={`Open ${tool.name}`}
          >
            <ToolCard tool={tool} showUser={showUser} showDescription={showDescription} />
          </Link>
        );
      })}
    </section>
  );
}


