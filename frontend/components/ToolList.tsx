import React from "react";
import Image from "next/image";
import { Tool } from "../services/toolService";

type ToolListProps = {
  tools: Tool[];
  showUser?: boolean;
  showDescription?: boolean;
  className?: string;
};

function ToolCard({ tool, showUser = false, showDescription = false }: { 
  tool: Tool; 
  showUser?: boolean; 
  showDescription?: boolean; 
}) {
  return (
    <article className="transition hover:opacity-80">
      <div className="aspect-[16/10] w-full bg-gray-200 rounded-2xl overflow-hidden relative">
        {tool.photoURL ? (
          <Image
            src={tool.photoURL}
            alt={tool.name}
            fill
            className="object-cover"
          />
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
        {showUser && (
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
  className = "" 
}: ToolListProps) {
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
      {tools.map((tool) => (
        <ToolCard 
          key={tool.id} 
          tool={tool} 
          showUser={showUser}
          showDescription={showDescription}
        />
      ))}
    </section>
  );
}
