import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import RequestTabs from "@/components/RequestTabs";

type RequestStatus = "new" | "accepted" | "rejected" | "pending";

type Person = {
  id: string;
  name: string;
};

type RequestItem = {
  id: string;
  person: Person;
  title: string; // e.g. wants to rent your hammer, accepted your request
  timeAgo: string; // e.g. 23 m, 5 d
  status?: RequestStatus;
  imageUrl?: string;
  priceSek?: number;
  dateFrom?: string;
  dateTo?: string;
  side: "received" | "sent";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [receivedData, setReceivedData] = useState<RequestItem[] | null>(null);
  const [sentData, setSentData] = useState<RequestItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map backend payloads to UI items
  function mapSent(payload: any[]): RequestItem[] {
    return (payload || []).map((r: any) => ({
      id: String(r.id),
      person: {
        id: String(r.tool?.user?.id ?? ""),
        name: r.tool?.user?.name ?? r.tool?.user?.username ?? "",
      },
      title: `You sent request to ${
        r.tool?.user?.name ?? r.tool?.user?.username ?? ""
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
    }));
  }

  function mapReceived(payload: any[]): RequestItem[] {
    return (payload || []).map((r: any) => ({
      id: String(r.id),
      person: {
        id: String(r.renter?.id ?? ""),
        name: r.renter?.name ?? r.renter?.username ?? "",
      },
      title: `${
        r.renter?.name ?? r.renter?.username ?? "Someone"
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
    }));
  }

  useEffect(() => {
    async function fetchData(kind: "received" | "sent") {
      try {
        setLoading(true);
        setError(null);
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const endpoint = `/api/requests/${
          kind === "received" ? "recieved" : "sent"
        }`; // note: backend uses 'recieved'
        const res = await fetch(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`Failed to load ${kind} requests`);
        const json = await res.json();
        if (kind === "received") setReceivedData(mapReceived(json));
        else setSentData(mapSent(json));
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    }

    fetchData("received");
    fetchData("sent");
  }, []);

  const currentList: RequestItem[] = useMemo(() => {
    const backend = tab === "received" ? receivedData : sentData;
    return backend ?? [];
  }, [tab, receivedData, sentData]);

  const list = currentList;
  const selected = list.find((d) => d.id === selectedId) || null;

  const counts = useMemo(
    () => ({
      received: (receivedData ?? []).length,
      sent: (sentData ?? []).length,
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
                setSelectedId(null);
              }}
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
                    onClick={() => setSelectedId(item.id)}
                  >
                    <Avatar />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-emerald-900 titillium-web-semibold">
                        {item.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-emerald-900/70">
                        <span className="text-sm">{item.timeAgo}</span>
                        {item.status === "new" && (
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
                <h3 className="mb-8 text-3xl md:text-4xl text-emerald-900 text-center titillium-web-black">
                  {selected.person.name} wants to rent your hammer
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
                  <div className="rounded-2xl border border-emerald-900/30 p-6 text-left">
                    <div className="flex items-center justify-start gap-3 text-emerald-900">
                      <Avatar />
                      <p className="titillium-web-semibold">
                        Josefine Dahlström
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-start gap-3 text-emerald-900">
                      <span>From</span>
                      <span className="rounded-2xl bg-emerald-700 text-white px-4 py-2 titillium-web-semibold">
                        {selected.dateFrom}
                      </span>
                      <span>to</span>
                      <span className="rounded-2xl bg-emerald-700 text-white px-4 py-2 titillium-web-semibold">
                        {selected.dateTo}
                      </span>
                    </div>
                    <p className="mt-4 text-emerald-900">
                      Price:{" "}
                      <span className="titillium-web-semibold">
                        {selected.priceSek} SEK
                      </span>
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-4">
                      <PrimaryButton className="bg-red-500 hover:bg-red-600">
                        Reject
                      </PrimaryButton>
                      <span className="text-emerald-900/70">or</span>
                      <PrimaryButton>Accept</PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <h3 className="mb-6 text-3xl text-emerald-900 text-center titillium-web-black">
                  {selected.person.name} accepted your request!
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
                  <div className="rounded-2xl border border-emerald-900/30 p-6 text-left">
                    <div className="flex items-center justify-start gap-3 text-emerald-900">
                      <Avatar />
                      <p className="titillium-web-semibold">Kamilla Dahlin</p>
                    </div>
                    <div className="mt-4 flex items-center justify-start gap-3 text-emerald-900">
                      <span>From</span>
                      <span className="rounded-2xl bg-emerald-700 text-white px-4 py-2 titillium-web-semibold">
                        {selected.dateFrom}
                      </span>
                      <span>to</span>
                      <span className="rounded-2xl bg-emerald-700 text-white px-4 py-2 titillium-web-semibold">
                        {selected.dateTo}
                      </span>
                    </div>
                    <p className="mt-4 text-emerald-900">
                      Price:{" "}
                      <span className="titillium-web-semibold">
                        {selected.priceSek} SEK
                      </span>
                    </p>
                    <div className="mt-6 flex justify-center">
                      <PrimaryButton className="bg-[#318EFF] hover:bg-[#1F73E6]">
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
    </main>
  );
}
