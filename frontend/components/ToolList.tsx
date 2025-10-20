import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Tool } from "../services/toolService";
import { useAuth } from "../hooks/auth"; 

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type ToolListProps = {
  tools: Tool[];
  showUser?: boolean;
  showDescription?: boolean;
  className?: string;
  useDynamicRoute?: boolean; // true for /{id}, false for /detailview?id={id}
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
  useDynamicRoute = false
}: ToolListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleNavigate = (id: number) => {
    setLoading(true);
    if (useDynamicRoute) {
      router.push(`/${id}`);
    } else {
      router.push(`/detailview?id=${id}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <p className="text-gray-600 mt-2">Loading tool...</p>
      </div>
    );
  }

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
        const ownerId = tool.user?.id ?? (tool as any).userId; 
        const isOwner = !!user && ownerId === user.id;

        // Use dynamic route logic if specified, otherwise use owner-based navigation
        if (useDynamicRoute) {
          return (
            <div
              key={tool.id}
              onClick={() => handleNavigate(tool.id)}
              className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 hover:shadow-md transition cursor-pointer"
              aria-label={`Open ${tool.name}`}
            >
              <ToolCard tool={tool} showUser={showUser} showDescription={showDescription} />
            </div>
          );
        }

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


