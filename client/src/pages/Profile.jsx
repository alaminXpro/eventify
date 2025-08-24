// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import {
  User as UserIcon,
  Mail,
  Shield,
  BadgeCheck,
  CalendarDays,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  ListChecks,
  Pencil,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  // Try common shapes: adjust if your slice differs
  const userFromStore = useSelector(
    (s) => s?.user?.user || s?.user?.currentUser || s?.auth?.user || null
  );

  const [user, setUser] = useState(userFromStore);
  const [loading, setLoading] = useState(!userFromStore);
  const [err, setErr] = useState("");

  // Fallback fetch on hard refresh
  useEffect(() => {
    if (userFromStore) {
      setUser(userFromStore);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const meRes =
          (await api.get("/auth/me").catch(() => null)) ||
          (await api.get("/users/me").catch(() => null));
        if (!active) return;
        if (meRes?.data) setUser(meRes.data);
        else setErr("Could not load profile");
      } catch (e) {
        if (!active) return;
        setErr(e?.response?.data?.message || "Could not load profile");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userFromStore]);

  const avatarUrl =
    user?.avatar ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const avatarLetter = useMemo(
    () => (user?.name ? user.name.charAt(0).toUpperCase() : "U"),
    [user?.name]
  );

  const prefs = user?.preferences || {};
  const prefBlocks = [
    { label: "Preferred Categories", key: "preferredEventCategory" },
    { label: "Preferred Formats", key: "preferredEventFormat" },
    { label: "Group Size", key: "eventGroupSize" },
    { label: "Popularity", key: "eventPopularity" },
  ];

  return (
    <section className="min-h-screen bg-[#0b1220] text-slate-100 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 shadow-lg">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-indigo-600 to-violet-600" />

          {/* Header */}
          <div className="-mt-12 flex items-end justify-between gap-4 px-6">
            <div className="flex items-end gap-4">
              {/* Avatar (image if present, fallback initial box) */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "avatar"}
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#0b1220]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                  }}
                />
              ) : (
                <div className="h-24 w-24 rounded-2xl ring-4 ring-[#0b1220] bg-slate-800 flex items-center justify-center text-3xl font-bold">
                  {avatarLetter}
                </div>
              )}

              <div className="pb-2">
                <h1 className="text-2xl font-bold">
                  {user?.name || (loading ? "Loading…" : "—")}
                </h1>
                <p className="text-slate-400">{user?.email || "—"}</p>
              </div>
            </div>

            {/* Edit Profile CTA */}
            <div className="pb-2">
              <button
                onClick={() => navigate("/profile/edit")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 px-3 py-2 text-sm hover:bg-slate-900/60"
                aria-label="Edit profile"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-8 mt-6 space-y-8">
            {/* Loading / Error */}
            {loading && (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                Loading profile…
              </div>
            )}
            {!!err && !loading && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-900/20 p-4 text-rose-200">
                {err}
              </div>
            )}

            {/* Account Basics */}
            <Section title="Account">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  label="Name"
                  value={user?.name}
                  icon={<UserIcon className="h-4 w-4" />}
                />
                <InfoCard
                  label="Email"
                  value={user?.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <InfoCard
                  label="Role"
                  value={user?.role}
                  icon={<Shield className="h-4 w-4" />}
                />
                <InfoCard
                  label="Email Verified"
                  value={user?.isEmailVerified ? "Yes" : "No"}
                  icon={<BadgeCheck className="h-4 w-4" />}
                />
                <InfoCard
                  label="User ID"
                  value={user?._id || user?.id}
                  icon={<Shield className="h-4 w-4" />}
                />
                <InfoCard
                  label="Joined"
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : ""
                  }
                  icon={<CalendarDays className="h-4 w-4" />}
                />
              </div>
            </Section>

            {/* Academic / Profile Details */}
            <Section title="Profile Details">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  label="Department"
                  value={user?.department}
                  icon={<GraduationCap className="h-4 w-4" />}
                />
                <InfoCard
                  label="Semester"
                  value={user?.semester}
                  icon={<GraduationCap className="h-4 w-4" />}
                />
                <InfoCard
                  label="Student ID"
                  value={user?.studentId}
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <InfoCard
                  label="Profession"
                  value={user?.profession}
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <InfoCard
                  label="Phone"
                  value={user?.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
                <InfoCard
                  label="Address"
                  value={user?.address}
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>

              {/* Bio */}
              {user?.bio ? (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-400">Bio</h3>
                  <p className="mt-2 text-slate-200">{user.bio}</p>
                </div>
              ) : null}
            </Section>

            {/* Skills */}
            {Array.isArray(user?.skills) && user.skills.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-indigo-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Preferences */}
            {prefBlocks.some(
              (b) => Array.isArray(prefs[b.key]) && prefs[b.key].length > 0
            ) && (
              <Section title="Preferences">
                <div className="grid gap-4 md:grid-cols-2">
                  {prefBlocks.map(({ label, key }) =>
                    Array.isArray(prefs[key]) && prefs[key].length > 0 ? (
                      <BlockList key={key} label={label} items={prefs[key]} />
                    ) : null
                  )}
                </div>
              </Section>
            )}

            {/* Links */}
            {(user?.website ||
              user?.cv ||
              user?.linkedin ||
              user?.twitter ||
              user?.facebook ||
              user?.github) && (
              <Section title="Links">
                <div className="grid gap-4 md:grid-cols-2">
                  {user?.website && (
                    <LinkRow href={user.website} icon={<Globe className="h-4 w-4" />}>
                      Website
                    </LinkRow>
                  )}
                  {user?.cv && (
                    <LinkRow href={user.cv} icon={<FileText className="h-4 w-4" />}>
                      CV / Resume
                    </LinkRow>
                  )}
                  {user?.linkedin && (
                    <LinkRow href={user.linkedin} icon={<Linkedin className="h-4 w-4" />}>
                      LinkedIn
                    </LinkRow>
                  )}
                  {user?.twitter && (
                    <LinkRow href={user.twitter} icon={<Twitter className="h-4 w-4" />}>
                      Twitter / X
                    </LinkRow>
                  )}
                  {user?.facebook && (
                    <LinkRow href={user.facebook} icon={<Facebook className="h-4 w-4" />}>
                      Facebook
                    </LinkRow>
                  )}
                  {user?.github && (
                    <LinkRow href={user.github} icon={<Github className="h-4 w-4" />}>
                      GitHub
                    </LinkRow>
                  )}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Small UI helpers ---------- */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        <ListChecks className="h-4 w-4 text-indigo-300" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-slate-100 break-words">{value || "—"}</div>
    </div>
  );
}

function BlockList({ label, items }) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-indigo-300"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function LinkRow({ href, icon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 text-indigo-300 hover:bg-slate-800/60 hover:underline"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
