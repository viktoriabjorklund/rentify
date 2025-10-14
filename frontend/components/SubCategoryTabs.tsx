import React from "react";

type SubCategory = "pending" | "accepted" | "rejected";

type Props = {
  active: SubCategory;
  counts: { pending: number; accepted?: number; rejected?: number };
  onChange: (subCategory: SubCategory) => void;
  isReceived?: boolean;
};

export default function SubCategoryTabs({
  active,
  counts,
  onChange,
  isReceived = false,
}: Props) {
  const ACTIVE = "#00B988";
  const INACTIVE = "#174B33";
  const getBadgeColor = (category: SubCategory) => {
    switch (category) {
      case "pending":
        return "bg-gray-500";
      case "accepted":
        return "bg-emerald-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const badge = (count: number, category: SubCategory) => (
    <span
      className={`ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full ${getBadgeColor(
        category
      )} px-2 text-xs titillium-web-semibold text-white`}
    >
      {count}
    </span>
  );

  return (
    <div className="mb-4 flex items-center gap-8">
      <button
        className="text-sm font-sans font-semibold"
        style={{ color: active === "pending" ? ACTIVE : INACTIVE }}
        onClick={() => onChange("pending")}
      >
        Pending
        {badge(counts.pending, "pending")}
      </button>

      {isReceived ? (
        // For received: show Accepted and Rejected
        <>
          <button
            className="text-sm font-sans font-semibold"
            style={{ color: active === "accepted" ? ACTIVE : INACTIVE }}
            onClick={() => onChange("accepted")}
          >
            Accepted
            {badge(counts.accepted || 0, "accepted")}
          </button>
          <button
            className="text-sm font-sans font-semibold"
            style={{ color: active === "rejected" ? ACTIVE : INACTIVE }}
            onClick={() => onChange("rejected")}
          >
            Rejected
            {badge(counts.rejected || 0, "rejected")}
          </button>
        </>
      ) : (
        // For sent:
        <>
          <button
            className="text-sm font-sans font-semibold"
            style={{ color: active === "accepted" ? ACTIVE : INACTIVE }}
            onClick={() => onChange("accepted")}
          >
            Accepted
            {badge(counts.accepted || 0, "accepted")}
          </button>
          <button
            className="text-sm font-sans font-semibold"
            style={{ color: active === "rejected" ? ACTIVE : INACTIVE }}
            onClick={() => onChange("rejected")}
          >
            Rejected
            {badge(counts.rejected || 0, "rejected")}
          </button>
        </>
      )}
    </div>
  );
}
