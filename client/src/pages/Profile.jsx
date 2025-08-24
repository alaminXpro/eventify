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
  X,
  ZoomIn,
} from "lucide-react";

const pretty = (v) => (v === 0 ? "0" : v ? String(v) : "—");

// Cartoon default avatar that will show for all users
const AVATAR_PLACEHOLDER =
  "https://api.dicebear.com/8.x/adventurer/svg?seed=default&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50";

// tiny hash so Unsplash choice is stable per user
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export default function Profile() {
  const navigate = useNavigate();
  const userFromStore = useSelector(
    (s) => s?.user?.user || s?.user?.currentUser || s?.auth?.user || null
  );

  const [user, setUser] = useState(userFromStore || null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showAvatarSplash, setShowAvatarSplash] = useState(false);

  // hydrate from localStorage on hard refresh
  useEffect(() => {
    if (!userFromStore && !user) {
      const saved = localStorage.getItem("currentUser");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep localStorage in sync with redux
  useEffect(() => {
    if (userFromStore) {
      setUser(userFromStore);
      try {
        localStorage.setItem("currentUser", JSON.stringify(userFromStore));
      } catch {}
    }
  }, [userFromStore]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setErr("");

      const userId = userFromStore?._id || userFromStore?.id;
      const studentId = userFromStore?.studentId || user?.studentId;

      let userData = null;

      if (userId) {
        try {
          const res = await api.get(`/users/${userId}`);
          userData = res.data;
        } catch {
          /* fall back */
        }
      }

      if (!userData && studentId) {
        const res = await api.get(`/users/profile/${encodeURIComponent(studentId)}`);
        userData = res.data;
      }

      if (userData) {
        setUser(userData);
        try {
          localStorage.setItem("currentUser", JSON.stringify(userData));
        } catch {}
      } else {
        setErr("Could not load profile. Please try again.");
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  // fetch once we know id or studentId
  useEffect(() => {
    const hasKeys = Boolean(
      userFromStore?._id ||
        userFromStore?.id ||
        userFromStore?.studentId ||
        user?.studentId
    );
    if (hasKeys) {
      fetchUserData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFromStore?._id, userFromStore?.id, userFromStore?.studentId, user?.studentId]);

  // ---------- Avatar: multi-source fallback ----------
  const avatarSeed = useMemo(() => {
    const key = user?._id || user?.id || user?.email || user?.name || "default";
    return hashString(String(key)) % 1000;
  }, [user?._id, user?.id, user?.email, user?.name]);

  const avatarCandidates = useMemo(() => {
    const userSeed = user?.name || user?.email || user?._id || user?.id || "DefaultUser";
    const cleanSeed = encodeURIComponent(userSeed.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    // Multiple cartoon avatar options
    const adventurerAvatar = `https://api.dicebear.com/8.x/adventurer/svg?seed=${cleanSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
    const avataaarsAvatar = `https://api.dicebear.com/8.x/avataaars/svg?seed=${cleanSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
    const pixelArtAvatar = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${cleanSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
    
    const list = [];
    // If user has uploaded a custom avatar, use it first
    if (user?.avatar && /^https?:\/\//i.test(user.avatar)) {
      list.push(user.avatar);
    }
    // Add cartoon avatars with user-specific seeds
    list.push(adventurerAvatar, avataaarsAvatar, pixelArtAvatar, AVATAR_PLACEHOLDER);
    return list;
  }, [user?.avatar, user?.name, user?.email, user?._id, user?.id]);

  const [avatarIdx, setAvatarIdx] = useState(0);
  useEffect(() => setAvatarIdx(0), [avatarCandidates.join("|")]); // reset when candidates change
  const avatarSrc =
    avatarCandidates[Math.min(avatarIdx, avatarCandidates.length - 1)] || AVATAR_PLACEHOLDER;

  // Get high-res version for splash (SVG scales automatically)
  const avatarSplashSrc = useMemo(() => {
    const current = avatarCandidates[Math.min(avatarIdx, avatarCandidates.length - 1)];
    if (!current) return AVATAR_PLACEHOLDER;
    
    // SVG avatars scale perfectly, no need to modify
    return current;
  }, [avatarCandidates, avatarIdx]);

  // Close splash on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowAvatarSplash(false);
      }
    };

    if (showAvatarSplash) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showAvatarSplash]);

  const prefs = user?.preferences || {};

  return (
    <section className="min-h-screen bg-[#0b1220] text-slate-100 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 shadow-lg">
          {/* Header (no cover) */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative group mx-auto sm:mx-0">
                  <img
                    src={avatarSrc}
                    alt={user?.name || "avatar"}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-4 ring-[#0b1220] cursor-pointer transition-transform duration-200 hover:scale-105"
                    onError={() => setAvatarIdx((i) => i + 1)}
                    onClick={() => setShowAvatarSplash(true)}
                  />
                  {/* Zoom overlay hint */}
                  <div className="absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                    <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {user?.name || (loading ? "Loading…" : "—")}
                  </h1>
                  <p className="text-slate-400 break-all">{user?.email || "—"}</p>
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
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
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-6 sm:space-y-8">
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

            {/* Account */}
            <Section title="Account">
              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
                <InfoCard label="Name" value={user?.name} icon={<UserIcon className="h-4 w-4" />} />
                <InfoCard label="Email" value={user?.email} icon={<Mail className="h-4 w-4" />} />
                <InfoCard label="Role" value={user?.role} icon={<Shield className="h-4 w-4" />} />
                <InfoCard
                  label="Email Verified"
                  value={user?.isEmailVerified ? "Yes" : "No"}
                  icon={<BadgeCheck className="h-4 w-4" />}
                />
                <InfoCard label="User ID" value={user?._id || user?.id} icon={<Shield className="h-4 w-4" />} />
                <InfoCard
                  label="Joined"
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                  icon={<CalendarDays className="h-4 w-4" />}
                />
              </div>
            </Section>

            {/* Profile details */}
            <Section title="Profile Details">
              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
                <InfoCard label="Department" value={user?.department} icon={<GraduationCap className="h-4 w-4" />} />
                <InfoCard label="Semester" value={user?.semester} icon={<GraduationCap className="h-4 w-4" />} />
                <InfoCard label="Student ID" value={user?.studentId} icon={<Briefcase className="h-4 w-4" />} />
                <InfoCard label="Profession" value={user?.profession} icon={<Briefcase className="h-4 w-4" />} />
                <InfoCard label="Phone" value={user?.phone} icon={<Phone className="h-4 w-4" />} />
                <InfoCard label="Address" value={user?.address} icon={<MapPin className="h-4 w-4" />} />
              </div>

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
                    <span key={s} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-indigo-300">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Preferences */}
            {["preferredEventCategory", "preferredEventFormat", "eventGroupSize", "eventPopularity"].some(
              (k) => Array.isArray(prefs[k]) && prefs[k].length > 0
            ) && (
              <Section title="Preferences">
                <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
                  {[
                    { label: "Preferred Categories", key: "preferredEventCategory" },
                    { label: "Preferred Formats", key: "preferredEventFormat" },
                    { label: "Group Size", key: "eventGroupSize" },
                    { label: "Popularity", key: "eventPopularity" },
                  ].map(({ label, key }) =>
                    Array.isArray(prefs[key]) && prefs[key].length > 0 ? (
                      <BlockList key={key} label={label} items={prefs[key]} />
                    ) : null
                  )}
                </div>
              </Section>
            )}

            {/* Links */}
            {(user?.website || user?.cv || user?.linkedin || user?.twitter || user?.facebook || user?.github) && (
              <Section title="Links">
                <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
                  {user?.website && <LinkRow href={user.website} icon={<Globe className="h-4 w-4" />}>Website</LinkRow>}
                  {user?.cv && <LinkRow href={user.cv} icon={<FileText className="h-4 w-4" />}>CV / Resume</LinkRow>}
                  {user?.linkedin && <LinkRow href={user.linkedin} icon={<Linkedin className="h-4 w-4" />}>LinkedIn</LinkRow>}
                  {user?.twitter && <LinkRow href={user.twitter} icon={<Twitter className="h-4 w-4" />}>Twitter / X</LinkRow>}
                  {user?.facebook && <LinkRow href={user.facebook} icon={<Facebook className="h-4 w-4" />}>Facebook</LinkRow>}
                  {user?.github && <LinkRow href={user.github} icon={<Github className="h-4 w-4" />}>GitHub</LinkRow>}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Splash Modal */}
      {showAvatarSplash && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowAvatarSplash(false)}
        >
          <div className="relative max-w-lg w-full">
            {/* Close button */}
            <button
              onClick={() => setShowAvatarSplash(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300 transition-colors"
              aria-label="Close avatar view"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Avatar image */}
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700/60">
              <img
                src={avatarSplashSrc}
                alt={user?.name || "avatar"}
                className="w-full h-auto rounded-xl object-cover shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onError={() => setAvatarIdx((i) => i + 1)}
              />
              
              {/* User info below avatar */}
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-white">
                  {user?.name || "User"}
                </h2>
                {user?.email && (
                  <p className="text-slate-400 text-sm mt-1">{user.email}</p>
                )}
                {user?.role && (
                  <p className="text-indigo-300 text-sm mt-1 capitalize">{user.role}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
      <div className="mt-1 text-slate-100 break-words">{pretty(value)}</div>
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
      className="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 text-indigo-300 hover:bg-slate-800/60 hover:underline break-all"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}