import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/axiosInstance";

export default function MyClubs() {
  const { currentUser } = useSelector((s) => s.user || {});
  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!currentUser?.id) return;
    let ignore = false;
    setLoading(true);
    setErr("");

    api
      .get(`/clubs?limit=${limit}&page=${page}&userId=${currentUser.id}`)
      .then((res) => {
        if (ignore) return;
        setClubs(res.data?.results || []);
      })
      .catch((e) =>
        setErr(e?.response?.data?.message || "Failed to load your clubs")
      )
      .finally(() => !ignore && setLoading(false));

    return () => (ignore = true);
  }, [page, limit, currentUser?.id]);

  return (
    <section className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-slate-300">
            <li>
              <Link
                to="/"
                className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 hover:bg-slate-800"
              >
                Home
              </Link>
            </li>
            <li className="text-slate-500">/</li>
            <li className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 font-semibold text-slate-100">
              My Clubs
            </li>
          </ol>
        </nav>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black">My Clubs</h1>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300">Items per page</label>
            <select
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        {!currentUser?.id ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-slate-200">
            Please <Link to="/login" className="text-indigo-300 underline">log in</Link> to see your clubs.
          </div>
        ) : loading ? (
          <GridSkeleton />
        ) : err ? (
          <div className="rounded-lg border border-rose-500/30 bg-rose-900/20 p-4 text-rose-200">
            {err}
          </div>
        ) : clubs.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-slate-300">You haven’t joined any clubs yet.</p>
            <Link
              to="/clubs/join"
              className="mt-3 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Explore Clubs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((c) => (
              <article
                key={c._id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
              >
                <div className="h-52 w-full overflow-hidden bg-slate-800">
                  <img
                    src={c.logo || "/placeholder.svg"}
                    alt={c.name || "club"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-semibold">
                    {c.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-300">
                    {c.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
                    <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5">
                      Member
                    </span>
                    {c.website && (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {currentUser?.id && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-slate-300">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={clubs.length < limit}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
        >
          <div className="h-52 w-full animate-pulse bg-slate-800" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-800" />
            <div className="h-8 w-40 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
