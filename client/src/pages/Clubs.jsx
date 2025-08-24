import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useSelector } from "react-redux";

export default function Clubs() {
  // If your /clubs requires auth('getClubs'), ensure user is logged in:
  const { currentUser } = useSelector((s) => s.user || {});
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr("");

    api
      .get(`/clubs?limit=${limit}&page=${page}`)
      .then((res) => {
        if (ignore) return;
        setClubs(res.data?.results || []);
      })
      .catch((e) => setErr(e?.response?.data?.message || "Failed to load clubs"))
      .finally(() => !ignore && setLoading(false));

    return () => (ignore = true);
  }, [page, limit]);

  return (
    <section className="min-h-screen bg-[#0b1220] text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black">Clubs</h1>
          <div className="flex items-center gap-3">
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

        {loading ? (
          <GridSkeleton />
        ) : err ? (
          <div className="rounded-lg border border-rose-500/30 bg-rose-900/20 p-4 text-rose-200">
            {err}
          </div>
        ) : clubs.length === 0 ? (
          <p className="text-slate-300">No clubs found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((c) => (
              <article
                key={c._id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
              >
                <div className="h-40 w-full overflow-hidden bg-slate-800">
                  <img
                    src={c.logo || "/placeholder.svg"}
                    alt={c.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-lg font-semibold">{c.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-300">{c.description}</p>

                  <div className="mt-4 flex items-center gap-2">
                    {c.website && (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
                      >
                        Visit
                      </a>
                    )}
                    <button
                      onClick={() => navigate(`/clubs/join?clubId=${c._id}`)}
                      className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Check Status
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

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
      </div>
    </section>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="h-40 w-full animate-pulse bg-slate-800" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
            <div className="h-8 w-40 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
