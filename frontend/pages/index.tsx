import Head from "next/head";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#F4F6F5" }}
    >
      {/* Decorative illustrations */}
      <img
        src="/tent.png"
        alt="Tent"
        className="hidden min-[1000px]:block pointer-events-none select-none absolute top-10 left-24 md:left-44 w-28 md:w-48 z-10 animate-jump-in animate-duration-700 animate-ease-out animate-once animate-delay-[1600ms]"
      />
      <img
        src="/tools.png"
        alt="Tools"
        className="hidden min-[1000px]:block pointer-events-none select-none absolute top-20 right-24 md:right-40 w-24 md:w-40 z-10 rotate-6 animate-jump-in animate-duration-700 animate-ease-out animate-once animate-delay-[1800ms]"
      />
      <img
        src="/speaker.png"
        alt="Speaker"
        className="hidden min-[1000px]:block pointer-events-none select-none absolute top-[360px] left-24 md:left-48 w-16 md:w-28 -rotate-6 z-10 animate-jump-in animate-duration-700 animate-ease-out animate-once animate-delay-[2000ms]"
      />
      <img
        src="/grasscutter.png"
        alt="Grasscutter"
        className="hidden min-[1000px]:block pointer-events-none select-none absolute top-[340px] right-24 md:right-40 w-32 md:w-48 z-10 animate-jump-in animate-duration-700 animate-ease-out animate-once animate-delay-[2200ms]"
      />
      <Head>
        <title>Rentify</title>
        <meta
          name="description"
          content="Rent tools easily – save money, earn money, and sustainify"
        />
      </Head>

      {/* Gradient green blobs */}
      <div
        className="pointer-events-none absolute -top-12 right-1/6 h-[620px] w-[620px] rounded-full blur-3xl z-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(142,221,174,1.0), rgba(142,221,174,0.0))",
        }}
      />
      <div
        className="pointer-events-none absolute -left-10 top-1/3 h-[560px] w-[560px] rounded-full blur-3xl z-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(142,221,174,1.0), rgba(142,221,174,0.0))",
        }}
      />

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-32">
        <h1
          className="text-6xl md:text-7xl font-bold tracking-tight text-emerald-900"
          style={{
            fontFamily:
              "Righteous, ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          }}
        >
          Rentify
        </h1>
        <div className="mt-8 w-full flex justify-center">
          <SearchBar
            onSearch={(q) => {
              const query = q.trim();
              router.push({
                pathname: "/searchpage",
                query: query ? { q: query } : {},
              });
            }}
          />
        </div>
        <div className="mt-4 text-center">
          <a className="text-emerald-900">
            Don't know what you're looking for? Find out&nbsp;
          </a>
          <a
            href="/searchpage"
            className="text-emerald-900 hover:text-emerald-700 transition-colors underline"
          >
            here!
          </a>
        </div>
      </section>

      {/* Why section */}
      <section className="relative z-10 mx-auto mt-32 max-w-6xl px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-900 text-center">
          Why Rentify?
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 text-center animate-fade-up animate-duration-700 animate-ease-out animate-fill-both animate-delay-600">
            <h3 className="text-2xl font-bold text-emerald-900">Save Money</h3>
            <p className="mt-3 text-emerald-900/80 titillium-web-regular text-lg md:text-xl">
              No need to buy costly tools you&apos;ll only use once.
            </p>
          </div>
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 text-center animate-fade-up animate-duration-700 animate-ease-out animate-fill-both animate-delay-1000">
            <h3 className="text-2xl font-bold text-emerald-900">Sustainify</h3>
            <p className="mt-3 text-emerald-900/80 titillium-web-regular text-lg md:text-xl">
              Sharing tools helps cut waste and protect the planet.
            </p>
          </div>
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 text-center animate-fade-up animate-duration-700 animate-ease-out animate-fill-both animate-delay-1400">
            <h3 className="text-2xl font-bold text-emerald-900">Earn Money</h3>
            <p className="mt-3 text-emerald-900/80 titillium-web-regular text-lg md:text-xl">
              Rent out your unused tools and get extra income.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
