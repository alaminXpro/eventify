// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";

/* Enums for chip/dropdown controls (keep here, or fetch from backend / share via a constants file) */
const SKILLS_ENUM = [
  "Programming","Web Development","App Development","Machine Learning","Artificial Intelligence","Data Science","Cybersecurity","Cloud Computing","IoT","Robotics","Blockchain","Game Development","UI/UX Design","Database Management","Version Control",
  "Public Speaking","Leadership","Team Management","Networking","Critical Thinking","Time Management","Project Management","Resume Writing","Interview Preparation","Career Planning",
  "Graphic Design","Video Editing","Photography","Creative Writing","Content Creation","Event Management","Drama","Music","Dance","Debate","Anchoring",
  "Entrepreneurship","Startup Pitching","Marketing","Social Media Marketing","Finance Basics","Business Strategy","Negotiation",
  "Football","Cricket","Basketball","Fitness Training","Yoga","Meditation","Stress Management","Nutrition",
  "Volunteering","Fundraising","Social Impact","Environmental Awareness","Diversity & Inclusion","Community Building",
];

const CATEGORY_ENUM   = ["Tech","Business","Design","Marketing","Finance","Law","Health","Education","Other"];
const FORMAT_ENUM     = ["Online","Offline","Hybrid","Workshop","Seminar","Conference","Hackathon","Meetup","Other"];
const GROUP_ENUM      = ["Small (1-10)","Medium (11-50)","Large (51-100)","Very Large (100+)"];
const POPULARITY_ENUM = ["Low","Medium","High","Very High"];

const DEPARTMENTS = ["", "CSE", "EEE", "CE", "ME", "BBA", "TE", "IPE"];
const SEMESTERS   = ["", "1.1", "1.2", "2.1", "2.2", "3.1", "3.2", "4.1", "4.2"];

/* Chip UI helpers */
function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors
      ${active ? "bg-indigo-600 text-white border-indigo-600"
               : "bg-slate-900/60 text-slate-200 border-slate-700/60 hover:bg-slate-800/60"}`}
    >
      {children}
    </button>
  );
}

function ChipMulti({ label, items, value, onChange }) {
  const toggle = (v) => {
    const set = new Set(value || []);
    set.has(v) ? set.delete(v) : set.add(v);
    onChange(Array.from(set));
  };
  return (
    <div>
      <div className="mb-1 block text-sm font-semibold text-slate-300">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <Chip key={it} active={(value || []).includes(it)} onClick={() => toggle(it)}>
            {it}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/* Fetch fresh user (by id first, then by studentId) */
async function fetchFreshUser({ userFromStore, fallbackUser }) {
  const id = userFromStore?._id || userFromStore?.id;
  const studentId = userFromStore?.studentId || fallbackUser?.studentId;

  if (id) {
    try {
      const { data } = await api.get(`/users/${id}`);
      return data;
    } catch (_) {}
  }
  if (studentId) {
    const { data } = await api.get(`/users/profile/${encodeURIComponent(studentId)}`);
    return data;
  }
  return null;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const userFromStore = useSelector(
    (s) => s?.user?.user || s?.user?.currentUser || s?.auth?.user || null
  );

  const [loading, setLoading] = useState(!userFromStore);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({
    email: "",
    name: "",
    department: "",
    semester: "",
    studentId: "",
    bio: "",
    profession: "",
    skills: [],
    phone: "",
    address: "",
    website: "",
    cv: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    github: "",
    preferences: {
      preferredEventCategory: [],
      preferredEventFormat: [],
      eventGroupSize: [],
      eventPopularity: [],
    },
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        if (userFromStore) {
          hydrateFromUser(userFromStore);
        } else {
          const me =
            (await api.get("/auth/me").catch(() => null)) ||
            (await api.get("/users/me").catch(() => null));
          if (me?.data) hydrateFromUser(me.data);
        }

        const fresh = await fetchFreshUser({ userFromStore, fallbackUser: form });
        if (active && fresh) {
          hydrateFromUser(fresh);
        } else if (active && !fresh && !userFromStore) {
          setErr("Could not load your profile.");
        }
      } catch (e) {
        if (active) setErr(e?.response?.data?.message || "Could not load your profile.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFromStore]);

  const userId = userFromStore?._id || userFromStore?.id;

  function hydrateFromUser(u) {
    setForm({
      email: u?.email || "",
      name:  u?.name  || "",
      department: u?.department ?? "",
      semester:   u?.semester   ?? "",
      studentId:  u?.studentId  ?? "",
      bio: u?.bio ?? "",
      profession: u?.profession ?? "",
      skills: Array.isArray(u?.skills)
        ? u.skills
        : (u?.skills ? String(u?.skills).split(",").map((s) => s.trim()).filter(Boolean) : []),
      phone: u?.phone ?? "",
      address: u?.address ?? "",
      website: u?.website ?? "",
      cv: u?.cv ?? "",
      linkedin: u?.linkedin ?? "",
      twitter: u?.twitter ?? "",
      facebook: u?.facebook ?? "",
      github: u?.github ?? "",
      preferences: {
        preferredEventCategory: Array.isArray(u?.preferences?.preferredEventCategory) ? u.preferences.preferredEventCategory : [],
        preferredEventFormat:   Array.isArray(u?.preferences?.preferredEventFormat)   ? u.preferences.preferredEventFormat   : [],
        eventGroupSize:         Array.isArray(u?.preferences?.eventGroupSize)         ? u.preferences.eventGroupSize         : [],
        eventPopularity:        Array.isArray(u?.preferences?.eventPopularity)        ? u.preferences.eventPopularity        : [],
      },
    });
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setPref  = (k, v) => setForm((f) => ({ ...f, preferences: { ...f.preferences, [k]: v }}));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!userId) {
      setErr("Missing user id.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: Array.isArray(form.skills)
          ? form.skills
          : String(form.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
        preferences: { ...form.preferences },
      };

      const { data: updated } = await api.patch(`/users/${userId}`, payload);

      try { localStorage.setItem("currentUser", JSON.stringify(updated)); } catch {}

      try {
        const fresh = await fetchFreshUser({ userFromStore: updated, fallbackUser: updated });
        if (fresh) hydrateFromUser(fresh);
      } catch {}

      setOk("Profile updated.");
      setTimeout(() => navigate("/profile"), 400);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0b1220] text-slate-100 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 px-3 py-2 text-sm hover:bg-slate-900/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-xl font-bold">Edit Profile</h1>
          <div />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60">
          {/* Header (no avatar) */}
          <div className="flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/60 ring-2 ring-[#0b1220]">
              <UserIcon className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Preview</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                {form.name || "Your Name"}
              </div>
              <div className="text-slate-400">{form.email || "you@example.com"}</div>
            </div>
          </div>

          {/* Messages */}
          {!!err && (
            <div className="mx-6 mb-4 rounded-lg border border-rose-500/30 bg-rose-900/20 p-3 text-rose-200">
              {err}
            </div>
          )}
          {!!ok && (
            <div className="mx-6 mb-4 rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-3 text-emerald-200">
              {ok}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="p-6 space-y-6">
            {/* Basic */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" value={form.name} onChange={(v) => setField("name", v)} placeholder="Full name" />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setField("email", v)} placeholder="you@university.edu" />
            </div>

            {/* Academic */}
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField label="Department" value={form.department} onChange={(v) => setField("department", v)} options={DEPARTMENTS} />
              <SelectField label="Semester" value={form.semester} onChange={(v) => setField("semester", v)} options={SEMESTERS} />
              <Field label="Student ID" value={form.studentId} onChange={(v) => setField("studentId", v)} placeholder="e.g., 2023xxxx" />
            </div>

            {/* About */}
            <Field label="Profession" value={form.profession} onChange={(v) => setField("profession", v)} placeholder="Student Developer" />
            <TextArea label="Bio" value={form.bio} onChange={(v) => setField("bio", v)} placeholder="Tell us about yourself (max 500 chars)" maxLength={500} />

            {/* Skills (chips) */}
            <ChipMulti label="Skills" items={SKILLS_ENUM} value={form.skills} onChange={(v) => setField("skills", v)} />

            {/* Contact */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Phone" value={form.phone} onChange={(v) => setField("phone", v)} placeholder="+8801XXXXXXXXX" />
              <Field label="Address" value={form.address} onChange={(v) => setField("address", v)} placeholder="City, Country" />
            </div>

            {/* Links */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Website" value={form.website} onChange={(v) => setField("website", v)} placeholder="https://your-site.com" />
              <Field label="CV (URL)" value={form.cv} onChange={(v) => setField("cv", v)} placeholder="https://drive.google.com/…" />
              <Field label="LinkedIn" value={form.linkedin} onChange={(v) => setField("linkedin", v)} placeholder="https://linkedin.com/in/…" />
              <Field label="Twitter / X" value={form.twitter} onChange={(v) => setField("twitter", v)} placeholder="https://twitter.com/…" />
              <Field label="Facebook" value={form.facebook} onChange={(v) => setField("facebook", v)} placeholder="https://facebook.com/…" />
              <Field label="GitHub" value={form.github} onChange={(v) => setField("github", v)} placeholder="https://github.com/…" />
            </div>

            {/* Preferences (chips) */}
            <div className="space-y-4">
              <ChipMulti
                label="Preferred Categories"
                items={CATEGORY_ENUM}
                value={form.preferences.preferredEventCategory}
                onChange={(v) => setPref("preferredEventCategory", v)}
              />
              <ChipMulti
                label="Preferred Formats"
                items={FORMAT_ENUM}
                value={form.preferences.preferredEventFormat}
                onChange={(v) => setPref("preferredEventFormat", v)}
              />
              <ChipMulti
                label="Group Size"
                items={GROUP_ENUM}
                value={form.preferences.eventGroupSize}
                onChange={(v) => setPref("eventGroupSize", v)}
              />
              <ChipMulti
                label="Popularity"
                items={POPULARITY_ENUM}
                value={form.preferences.eventPopularity}
                onChange={(v) => setPref("eventPopularity", v)}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="rounded-lg border border-slate-700/60 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* Small inputs */
function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-300">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-300">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
      >
        {options.map((opt) => (
          <option key={opt || "blank"} value={opt}>
            {opt === "" ? "—" : opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, maxLength }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-300">{label}</span>
      <textarea
        rows={4}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
      />
      {maxLength ? (
        <div className="mt-1 text-right text-xs text-slate-400">
          {(value?.length || 0)}/{maxLength}
        </div>
      ) : null}
    </label>
  );
}
