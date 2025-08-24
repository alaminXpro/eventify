import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/axiosInstance";
import { useSearchParams } from "react-router-dom";

export default function JoinClub() {
  const { currentUser } = useSelector((s) => s.user || {});
  const userId = currentUser?.id || currentUser?._id; // support both shapes

  const [searchParams] = useSearchParams();
  const preselectId = searchParams.get("clubId");

  const [clubs, setClubs] = useState([]);
  const [selected, setSelected] = useState(preselectId || "");
  const [status, setStatus] = useState("");
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr("");
    api
      .get(`/clubs?limit=50&page=1`)
      .then((res) => {
        if (ignore) return;
        setClubs(res.data?.results || []);
      })
      .catch((e) => setErr(e?.response?.data?.message || "Failed to load clubs"))
      .finally(() => !ignore && setLoading(false));
    return () => (ignore = true);
  }, []);

  const selectedClub = useMemo(
    () => clubs.find((c) => c._id === selected),
    [clubs, selected]
  );

  const checkStatus = async () => {
    if (!selected || !userId) {
      alert("Pick a club and make sure you are logged in.");
      return;
    }
    setChecking(true);
    setStatus("");
    try {
      // Backend: POST /clubs/:clubId/status  { userId }
      const res = await api.post(`/clubs/${selected}/status`, { userId });
      setStatus(res.data?.status || "unknown");
    } catch (e) {
      if (e?.response?.status === 404) setStatus("not-found");
      else setStatus("error");
    } finally {
      setChecking(false);
    }
  };

  // ===== JOIN (commented) — enable when you add backend route to push user to pending =====
  // const requestJoin = async () => {
  //   if (!selected || !userId) {
  //     alert("Pick a club and make sure you are logged in.");
  //     return;
  //   }
  //   try {
  //     // e.g. await api.post(`/clubs/${selected}/join`, { userId });
  //     // (Your backend can call addUserToPendingList(clubId, userId))
  //     alert("Requested to join! (Wire backend route to enable)");
  //   } catch (e) {
  //     alert(e?.response?.data?.message || "Failed to request join");
  //   }
  // };
  // ========================================================================================

  return (
    <section className="min-h-screen bg-[#0b1220] text-slate-100 py-10">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="mb-6 text-2xl font-black">Join a Club (Status Check)</h1>

        {loading ? (
          <div className="h-32 animate-pulse rounded-lg border border-slate-800 bg-slate-900" />
        ) : err ? (
          <div className="rounded-lg border border-rose-500/30 bg-rose-900/20 p-4 text-rose-200">
            {err}
          </div>
        ) : (
          <>
            <label className="mb-1 block text-sm font-semibold text-slate-200">
              Select club
            </label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="">— Choose a club —</option>
              {clubs.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {selectedClub && (
              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedClub.logo}
                    alt={selectedClub.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div>
                    <div className="font-semibold">{selectedClub.name}</div>
                    <div className="text-xs text-slate-400 line-clamp-2">
                      {selectedClub.description}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={checkStatus}
                disabled={!selected || checking}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {checking ? "Checking..." : "Check Status"}
              </button>

              {/* Enable when backend route exists */}
              {/*
              <button
                onClick={requestJoin}
                disabled={!selected}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Request to Join
              </button>
              */}
            </div>

            {status && (
              <div className="mt-5">
                <Badge status={status} />
                {status === "not-found" && (
                  <p className="mt-2 text-sm text-slate-300">
                    You’re not in this club yet. Contact a moderator or try
                    requesting when the Join endpoint is available.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Badge({ status }) {
  const map = {
    enrolled: "bg-emerald-600/15 text-emerald-300 border-emerald-600/30",
    pending: "bg-amber-600/15 text-amber-300 border-amber-600/30",
    "not-found": "bg-slate-700/30 text-slate-300 border-slate-600/40",
    error: "bg-rose-600/15 text-rose-300 border-rose-600/30",
  };
  const label =
    { enrolled: "Member", pending: "Pending", "not-found": "Not In Club", error: "Error" }[status] ||
    status;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${map[status] || ""}`}
    >
      {label}
    </span>
  );
}
