import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import RequestTabs from "@/components/RequestTabs";
import SubCategoryTabs from "@/components/SubCategoryTabs";
import { ContactDialog } from "@/components/dialogs/ContactDialog";
import {
  getReceivedRequests,
  getSentRequests,
  markRequestAsViewed,
  updateRequestStatus,
} from "../services/requestService";

type RequestStatus = "new" | "accepted" | "rejected" | "pending";
type SubCategory = "pending" | "accepted" | "rejected";

type Person = {
  id: string;
  name: string;
};

type RequestItem = {
  id: string;
  person: Person;
  title: string;
  timeAgo: string;
  status?: RequestStatus;
  imageUrl?: string;
  priceSek?: number;
  dateFrom?: string;
  dateTo?: string;
  side: "received" | "sent";
  detailName?: string;
  viewed?: boolean;
};

const InboxIcon = ({
  className = "w-14 h-14 text-emerald-900",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 12l2-6a2 2 0 012-1h10a2 2 0 012 1l2 6v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12h5l2 3h4l2-3h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhotoPlaceholder = () => (
  <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-emerald-900/5 ring-1 ring-emerald-900/10">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-emerald-900/60"
    >
      <path
        d="M4 7h3l2-2h6l2 2h3a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  </div>
);

const Avatar = () => (
  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-900">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
    >
      <path
        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 1114 0v1H5v-1z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default function RequestsPage() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [subCategory, setSubCategory] = useState<SubCategory>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [receivedData, setReceivedData] = useState<RequestItem[] | null>(null);
  const [sentData, setSentData] = useState<RequestItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactPerson, setContactPerson] = useState<{
    name: string;
    phone?: string;
    email?: string;
  } | null>(null);

  const handleRequestClick = async (item: RequestItem) => {
    setSelectedId(item.id);
    if (item.side === "received" && item.status === "new" && !item.viewed) {
      try {
        await markRequestAsViewed(Number(item.id));
        setReceivedData(
          (prev) =>
            prev?.map((req) =>
              req.id === item.id ? { ...req, viewed: true } : req
            ) ?? []
        );
      } catch (err) {
        console.error("Failed to mark request as viewed:", err);
      }
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await updateRequestStatus(Number(requestId), {
        accepted: true,
        pending: false,
      });

      setReceivedData(
        (prev) =>
          prev?.map((req) =>
            req.id === requestId
              ? { ...req, status: "accepted" as RequestStatus }
              : req
          ) ?? []
      );
    } catch (err) {
      console.error("Failed to accept request:", err);
      setError("Failed to accept request. Please try again.");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await updateRequestStatus(Number(requestId), {
        accepted: false,
        pending: false,
      });

      setReceivedData(
        (prev) =>
          prev?.map((req) =>
            req.id === requestId
              ? { ...req, status: "rejected" as RequestStatus }
              : req
          ) ?? []
      );
    } catch (err) {
      console.error("Failed to reject request:", err);
      setError("Failed to reject request. Please try again.");
    }
  };

  const handleContactOwner = (selected: RequestItem) => {
    setContactPerson({
      name: selected.detailName || selected.person.name,
      phone: "test phone", // TODO: Get from backend //Corre
      email: "test@test.com", // TODO: Get from backend // Corre
    });
    setContactDialogOpen(true);
  };

  const handleContactRenter = (selected: RequestItem) => {
    // For received requests, contact the renter
    setContactPerson({
      name: selected.detailName || selected.person.name,
      phone: "test phone", // TODO: Get from backend //Corre
      email: "test@test.com", // TODO: Get from backend /Corre
    });
    setContactDialogOpen(true);
  };

  function mapSent(payload: any[]): RequestItem[] {
    const firstName = (u: any) => u?.name?.toString().trim() || "";
    const fullName = (u: any) => {
      const first = u?.name?.toString().trim();
      const last = u?.surname?.toString().trim();
      const username = u?.username?.toString().trim();
      const full = [first, last].filter(Boolean).join(" ");
      return full || first || username || "";
    };
    return (payload || []).map((r: any) => ({
      id: String(r.id),
      person: {
        id: String(r.tool?.user?.id ?? ""),
        name: firstName(r.tool?.user) || r.tool?.user?.username || "",
      },
      title: `You sent request to ${
        firstName(r.tool?.user) || r.tool?.user?.username || ""
      }`,
      timeAgo: "",
      side: "sent",
      status: r.accepted ? "accepted" : r.pending ? "pending" : "rejected",
      imageUrl: undefined,
      priceSek: r.price ?? r.tool?.price ?? undefined,
      dateFrom: r.startDate
        ? new Date(r.startDate)
            .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
            .toLowerCase()
        : undefined,
      dateTo: r.endDate
        ? new Date(r.endDate)
            .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
            .toLowerCase()
        : undefined,
      detailName: fullName(r.tool?.user),
      viewed: r.viewed ?? false,
    }));
  }

  function mapReceived(payload: any[]): RequestItem[] {
    const firstName = (u: any) => u?.name?.toString().trim() || "";
    const fullName = (u: any) => {
      const first = u?.name?.toString().trim();
      const last = u?.surname?.toString().trim();
      const username = u?.username?.toString().trim();
      const full = [first, last].filter(Boolean).join(" ");
      return full || first || username || "";
    };
    return (payload || []).map((r: any) => ({
      id: String(r.id),
      person: {
        id: String(r.renter?.id ?? ""),
        name: firstName(r.renter) || r.renter?.username || "",
      },
      title: `${
        firstName(r.renter) || r.renter?.username || "Someone"
      } send a request`,
      timeAgo: "",
      side: "received",
      status: r.pending ? "new" : r.accepted ? "accepted" : "rejected",
      imageUrl: undefined,
      priceSek: r.price ?? r.tool?.price ?? undefined,
      dateFrom: r.startDate
        ? new Date(r.startDate)
            .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
            .toLowerCase()
        : undefined,
      dateTo: r.endDate
        ? new Date(r.endDate)
            .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
            .toLowerCase()
        : undefined,
      detailName: fullName(r.renter),
      viewed: r.viewed ?? false,
    }));
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [rec, sent] = await Promise.all([
          getReceivedRequests(),
          getSentRequests(),
        ]);
        setReceivedData(mapReceived(rec as any[]));
        setSentData(mapSent(sent as any[]));
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentList: RequestItem[] = useMemo(() => {
    const backend = tab === "received" ? receivedData : sentData;
    const allRequests = (backend ?? []).filter(
      (req) => req.status !== "rejected"
    );

    // Filter based on subcategory
    return allRequests.filter((req) => {
      if (tab === "received") {
        switch (subCategory) {
          case "pending":
            return req.status === "new"; // All new requests (both viewed and not viewed)
          case "accepted":
            return req.status === "accepted";
          default:
            return false;
        }
      } else {
        // sent
        switch (subCategory) {
          case "pending":
            return req.status === "pending";
          case "accepted":
            return req.status === "accepted";
          case "rejected":
            return req.status === "rejected";
          default:
            return false;
        }
      }
    });
  }, [tab, subCategory, receivedData, sentData]);

  const list = currentList;
  const selected = list.find((d) => d.id === selectedId) || null;

  const counts = useMemo(
    () => ({
      received: {
        pending: (receivedData ?? []).filter(
          (req) => req.status === "new" && !req.viewed
        ).length,
        accepted: (receivedData ?? []).filter(
          (req) => req.status === "accepted"
        ).length,
      },
      sent: {
        pending: (sentData ?? []).filter(
          (req) => req.status === "pending" && !req.viewed
        ).length,
        accepted: (sentData ?? []).filter((req) => req.status === "accepted")
          .length,
        rejected: (sentData ?? []).filter((req) => req.status === "rejected")
          .length,
      },
    }),
    [receivedData, sentData]
  );

  return (
    <main
      className="relative min-h-screen"
      style={{ backgroundColor: "#F4F6F5" }}
    >
      <Head>
        <title>Requests • Rentify</title>
      </Head>

      <section className="mx-auto max-w-7xl px-6 pt-20 md:pt-24 pb-16 titillium-web-regular">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)]">
          <div>
            <div className="mb-9 flex items-center gap-3">
              <h1 className="text-5xl md:text-6xl tracking-tight text-emerald-900 font-sans">
                Requests
              </h1>
              <InboxIcon className="h-15 w-15 text-emerald-900" />
            </div>

            {/* Tabs */}
            <RequestTabs
              active={tab}
              counts={counts}
              onChange={(next) => {
                setTab(next);
                setSubCategory("pending");
                setSelectedId(null);
              }}
            />

            <SubCategoryTabs
              active={subCategory}
              counts={tab === "received" ? counts.received : counts.sent}
              onChange={(next) => {
                setSubCategory(next);
                setSelectedId(null);
              }}
              isReceived={tab === "received"}
            />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          {/* List column */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4">
            <ul className="divide-y divide-emerald-900/10">
              {list.map((item) => (
                <li key={item.id}>
                  <button
                    className={`flex w-full items-center gap-4 px-2 py-5 text-left transition hover:bg-emerald-50/60 ${
                      selectedId === item.id ? "bg-emerald-50" : ""
                    }`}
                    onClick={() => handleRequestClick(item)}
                  >
                    <Avatar />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-emerald-900 titillium-web-semibold">
                        {item.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-emerald-900/70">
                        <span className="text-sm">{item.timeAgo}</span>
                        {item.status === "new" && !item.viewed && (
                          <span className="inline-block h-2 w-2 rounded-full bg-[#318EFF]" />
                        )}
                        {item.status === "accepted" && (
                          <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-900">
                            Accepted
                          </span>
                        )}
                        {item.status === "rejected" && (
                          <span className="rounded-full bg-red-200 px-2 py-0.5 text-xs font-semibold text-red-900">
                            Rejected
                          </span>
                        )}
                        {item.status === "pending" && (
                          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail column */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 md:p-10 min-h-[460px] flex items-center justify-center">
            {!selected ? (
              <div className="text-center">
                <h2 className="text-2xl md:text-4xl tracking-tight text-emerald-900 font-sans">
                  No request has been selected
                </h2>
                <p className="text-l md:text-xl mt-2 text-emerald-900/80 titillium-web-regular">
                  Please choose a request to respond to.
                </p>
                <div className="mt-4 flex justify-center">
                  <InboxIcon className="h-20 w-20 text-emerald-900" />
                </div>
              </div>
            ) : tab === "received" ? (
              <div className="w-full">
                <h3 className="mb-8 text-3xl md:text-4xl text-emerald-900 text-center titillium-web-semibold">
                  {selected.status === "accepted"
                    ? `You have accepted ${selected.person.name}'s request`
                    : `${selected.person.name} wants to rent your hammer`}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_380px] items-center">
                  <div className="overflow-hidden rounded-2xl">
                    {selected.imageUrl ? (
                      <img
                        src={selected.imageUrl}
                        alt="Item"
                        className="h-64 w-full object-cover"
                      />
                    ) : (
                      <PhotoPlaceholder />
                    )}
                  </div>
                  <div className="rounded-2xl border border-emerald-900/30 p-6 text-center">
                    <div className="flex items-center justify-center gap-3 text-emerald-900 mb-4">
                      <Avatar />
                      <p className="titillium-web-semibold">
                        {selected.detailName || selected.person.name}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-3 text-emerald-900">
                      <span className="titillium-web-semibold text-lg">
                        From
                      </span>
                      <span className="rounded-xl bg-emerald-700 text-white px-4 py-1.5 titillium-web-semibold">
                        {selected.dateFrom}
                      </span>
                      <span className="titillium-web-semibold text-lg">to</span>
                      <span className="rounded-xl bg-emerald-700 text-white px-4 py-1.5 titillium-web-semibold">
                        {selected.dateTo}
                      </span>
                    </div>
                    <p className="mt-4 text-emerald-900 text-lg">
                      <span className="titillium-web-semibold">Price:</span>{" "}
                      <span className="titillium-web-semibold">
                        {selected.priceSek} SEK
                      </span>
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                      {selected.status === "accepted" ? (
                        <PrimaryButton
                          className="bg-[#318EFF] hover:bg-[#1F73E6]"
                          onClick={() => handleContactRenter(selected)}
                        >
                          Contact renter
                        </PrimaryButton>
                      ) : (
                        <>
                          <PrimaryButton
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleReject(selected.id)}
                          >
                            Reject
                          </PrimaryButton>
                          <span className="text-emerald-900/70">or</span>
                          <PrimaryButton
                            onClick={() => handleAccept(selected.id)}
                          >
                            Accept
                          </PrimaryButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <h3 className="mb-6 text-3xl text-emerald-900 text-center titillium-web-semibold">
                  {selected.status === "pending"
                    ? `Waiting for ${selected.person.name} to respond to your request`
                    : selected.status === "accepted"
                    ? `${selected.person.name} accepted your request!`
                    : `${selected.person.name} rejected your request`}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_380px] items-center">
                  <div className="overflow-hidden rounded-2xl">
                    {selected.imageUrl ? (
                      <img
                        src={selected.imageUrl}
                        alt="Item"
                        className="h-64 w-full object-cover"
                      />
                    ) : (
                      <PhotoPlaceholder />
                    )}
                  </div>
                  <div className="rounded-2xl border border-emerald-900/30 p-6 text-center">
                    <div className="flex items-center justify-center gap-3 text-emerald-900 mb-4">
                      <Avatar />
                      <p className="titillium-web-semibold">
                        {selected.detailName || selected.person.name}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-3 text-emerald-900">
                      <span className="titillium-web-semibold text-lg">
                        From
                      </span>
                      <span className="rounded-xl bg-emerald-700 text-white px-4 py-1.5 titillium-web-semibold">
                        {selected.dateFrom}
                      </span>
                      <span className="titillium-web-semibold text-lg">to</span>
                      <span className="rounded-xl bg-emerald-700 text-white px-4 py-1.5 titillium-web-semibold">
                        {selected.dateTo}
                      </span>
                    </div>
                    <p className="mt-4 text-emerald-900 text-lg">
                      <span className="titillium-web-semibold">Price:</span>{" "}
                      <span className="titillium-web-semibold">
                        {selected.priceSek} SEK
                      </span>
                    </p>
                    <div className="mt-6 flex justify-center">
                      <PrimaryButton
                        className="bg-[#318EFF] hover:bg-[#1F73E6]"
                        onClick={() => handleContactOwner(selected)}
                      >
                        Contact Owner
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Dialog */}
      <ContactDialog
        isOpen={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        phoneNumber={contactPerson?.phone}
        email={contactPerson?.email}
        ownerName={contactPerson?.name}
      />
    </main>
  );
}
