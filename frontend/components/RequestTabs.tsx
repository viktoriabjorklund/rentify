import React from "react";

type Props = {
  active: "received" | "sent";
  counts: {
    received: { unviewed: number };
    sent: { unviewed: number };
  };
  onChange: (tab: "received" | "sent") => void;
};

export default function RequestTabs({ active, counts, onChange }: Props) {
  const tabClass = (isActive: boolean) =>
    `${
      isActive ? "text-[#00B988]" : "text-[#174B33]"
    } relative text-2xl font-sans font-semibold`;

  const badge = (count: number) => (
    <span className="ml-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[#318EFF] px-2 text-base titillium-web-semibold text-white">
      {count}
    </span>
  );

  return (
    <div className="mb-6 flex items-center gap-6 text-emerald-900">
      <button
        className={tabClass(active === "received")}
        onClick={() => onChange("received")}
      >
        Received
        {badge(counts.received.unviewed)}
      </button>
      <span className="h-6 w-px bg-emerald-900/30" />
      <button
        className={tabClass(active === "sent")}
        onClick={() => onChange("sent")}
      >
        Sent
        {badge(counts.sent.unviewed)}
      </button>
    </div>
  );
}
