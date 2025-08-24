// src/pages/EditProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";

// Optional: if you have an action to replace the user in Redux,
// import it here. Otherwise we'll just navigate after saving.
// import { setUser } from "../redux/user/userSlice";

const DEPARTMENTS = ["", "CSE", "EEE", "CE", "ME", "BBA", "TE", "IPE"];
const SEMESTERS = ["", "1.1", "1.2", "2.1", "2.2", "3.1", "3.2", "4.1", "4.2"];

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Try common shapes used in your project
  const userFromStore = useSelector(
    (s) => s?.user?.user || s?.user?.currentUser || s?.auth?.user || null
  );

  const [loading, setLoading] = useState(!userFromStore);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // Form state (exact keys match your Joi & Mongoose schema)
  const [form, setForm] = useState({
    email: "",
    name: "",
    avatar: "",
    department: "",
    semester: "",
    studentId: "",
    bio: "",
    profession: "",
    skills: "", // comma-separated (server can split)
    phone: "",
    address: "",
    website: "",
    cv: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    github: "",
  });

  // Fetch on hard refresh if Redux is empty
  useEffect(() => {
    if (userFromStore) {
      hydrateFromUser(userFromStore);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const me =
          (await api.get("/auth/me").catch(() => null)) ||
          (await api.get("/users/me").catch(() => null));
        if (!active) return;
        if (me?.data) {
          hydrateFromUser(me.data);
        } else {
          setErr("Could not load your profile.");
        }
      } catch (e) {
        if (!active) return;
        setErr(e?.response?.data?.message || "Could not load your profile.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFromStore]);

  const userId = useMemo(() => {
    const u = userFromStore;
    return u?._id || u?.id;
  }, [userFromStore]);

  function hydrateFromUser(u) {
    setForm({
      email: u?.email || "",
      name: u?.name || "",
      avatar:
        u?.avatar ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      department: u?.department ?? "",
      semester: u?.semester ?? "",
      studentId: u?.studentId ?? "",
      bio: u?.bio ?? "",
      profession: u?.profession ?? "",
      // If it's already an array, join to comma string; if string, use as-is
      skills: Array.isArray(u?.skills) ? u.skills.join(", ") : (u?.skills || ""),
      phone: u?.phone ?? "",
      address: u?.address ?? "",
      website: u?.website ?? "",
      cv: u?.cv ?? "",
      linkedin: u?.linkedin ?? "",
      twitter: u?.twitter ?? "",
      facebook: u?.facebook ?? "",
      github: u?.github ?? "",
    });
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

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
      // Only include fields we actually send (Joi .min(1) ok)
      // Note: sending empty strings is allowed by your Joi to "clear" fields.
      const payload = { ...form };

      // The backend accepts either array or string for `skills`.
      // We'll send the comma string; backend will split.
      // If you prefer array, you could do:
      // payload.skills = form.skills
      //  ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
      //  : [];

      const { data: updated } = await api.patch(`/users/${userId}`, payload);

      // If you keep the user in Redux, refresh it here:
      // dispatch(setUser(updated));

      setOk("Profile updated.");
      // Go back to /profile after a moment (optional)
      setTimeout(() => navigate("/profile"), 600);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Live avatar preview
  const avatarSrc =
    form.avatar?.trim() ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

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
          {/* Header */}
          <div className="flex items-start gap-4 p-6">
            <img
              src={avatarSrc}
              alt="avatar"
              className="h-20 w-20 rounded-xl object-cover ring-2 ring-[#0b1220]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
              }}
            />
            <div>
              <div className="text-sm text-slate-400">Preview</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                <UserIcon className="h-4 w-4 text-indigo-300" />
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
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setField("name", v)}
                placeholder="Full name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setField("email", v)}
                placeholder="you@university.edu"
              />
            </div>

            <Field
              label="Avatar (URL)"
              value={form.avatar}
              onChange={(v) => setField("avatar", v)}
              placeholder="https://…"
            />

            {/* Academic */}
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField
                label="Department"
                value={form.department}
                onChange={(v) => setField("department", v)}
                options={DEPARTMENTS}
              />
              <SelectField
                label="Semester"
                value={form.semester}
                onChange={(v) => setField("semester", v)}
                options={SEMESTERS}
              />
              <Field
                label="Student ID"
                value={form.studentId}
                onChange={(v) => setField("studentId", v)}
                placeholder="e.g., 2023xxxx"
              />
            </div>

            {/* About */}
            <Field
              label="Profession"
              value={form.profession}
              onChange={(v) => setField("profession", v)}
              placeholder="Student Developer"
            />
            <TextArea
              label="Bio"
              value={form.bio}
              onChange={(v) => setField("bio", v)}
              placeholder="Tell us about yourself (max 500 chars)"
              maxLength={500}
            />

            {/* Skills */}
            <Field
              label="Skills (comma separated)"
              value={form.skills}
              onChange={(v) => setField("skills", v)}
              placeholder="JavaScript, Python, React"
            />

            {/* Contact */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setField("phone", v)}
                placeholder="+8801XXXXXXXXX"
              />
              <Field
                label="Address"
                value={form.address}
                onChange={(v) => setField("address", v)}
                placeholder="City, Country"
              />
            </div>

            {/* Links */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Website"
                value={form.website}
                onChange={(v) => setField("website", v)}
                placeholder="https://your-site.com"
              />
              <Field
                label="CV (URL)"
                value={form.cv}
                onChange={(v) => setField("cv", v)}
                placeholder="https://drive.google.com/…"
              />
              <Field
                label="LinkedIn"
                value={form.linkedin}
                onChange={(v) => setField("linkedin", v)}
                placeholder="https://linkedin.com/in/…"
              />
              <Field
                label="Twitter / X"
                value={form.twitter}
                onChange={(v) => setField("twitter", v)}
                placeholder="https://twitter.com/…"
              />
              <Field
                label="Facebook"
                value={form.facebook}
                onChange={(v) => setField("facebook", v)}
                placeholder="https://facebook.com/…"
              />
              <Field
                label="GitHub"
                value={form.github}
                onChange={(v) => setField("github", v)}
                placeholder="https://github.com/…"
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

/* ---------------- Small inputs ---------------- */

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
