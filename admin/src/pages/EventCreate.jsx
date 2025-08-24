// src/pages/EventCreate.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import axiosInstance from "../utils/axiosInstance";
import {
  BookmarkPlus,
  Sparkles,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Hash,
  Upload,
  CheckCircle2,
} from "lucide-react";

/** If you expose SKILLS_ENUM to the client, import it and                  {clubs.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}ace this. */
const SKILLS_ENUM_FALLBACK = [
  // Technical
  "Programming",
  "Web Development",
  "App Development",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "IoT",
  "Robotics",
  "Blockchain",
  "Game Development",
  "UI/UX Design",
  "Database Management",
  "Version Control",

  // Professional & Career
  "Public Speaking",
  "Leadership",
  "Team Management",
  "Networking",
  "Critical Thinking",
  "Time Management",
  "Project Management",
  "Resume Writing",
  "Interview Preparation",
  "Career Planning",

  // Creative & Cultural
  "Graphic Design",
  "Video Editing",
  "Photography",
  "Creative Writing",
  "Content Creation",
  "Event Management",
  "Drama",
  "Music",
  "Dance",
  "Debate",
  "Anchoring",

  // Entrepreneurship & Business
  "Entrepreneurship",
  "Startup Pitching",
  "Marketing",
  "Social Media Marketing",
  "Finance Basics",
  "Business Strategy",
  "Negotiation",

  // Sports & Wellness
  "Football",
  "Cricket",
  "Basketball",
  "Fitness Training",
  "Yoga",
  "Meditation",
  "Stress Management",
  "Nutrition",

  // Social & Community
  "Volunteering",
  "Fundraising",
  "Social Impact",
  "Environmental Awareness",
  "Diversity & Inclusion",
  "Community Building"
];

const CATEGORIES = [
  "Tech",
  "Business",
  "Design",
  "Marketing",
  "Finance",
  "Law",
  "Health",
  "Education",
  "Other",
];

const EVENT_TYPES = ["online", "offline", "hybrid"];

/* ----------------------------- Small UI Pieces ---------------------------- */
function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border
        ${selected ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800"}`}
    >
      {children}
    </button>
  );
}

Chip.propTypes = {
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

function TagInput({ value, onChange, placeholder = "Type and press Enter" }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft("");
  };

  const remove = (i) => {
    const next = [...value];
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {value.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
          >
            #{t}
            <button
              type="button"
              className="text-slate-400 hover:text-slate-200"
              onClick={() => remove(i)}
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? (e.preventDefault(), add()) : null)}
          className="flex-1 rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

TagInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

/* ---------------------------------- Page --------------------------------- */
export default function EventCreate() {
  const navigate = useNavigate();

  // Form state mapped 1:1 with your schema (names matter!)
  const [form, setForm] = useState({
    title: "",
    event_description: "",
    category: "",
    club_hosting: "",
    event_date: "",
    event_time_duration: "", // string (e.g. "10:00 - 12:00 (120m)")
    registration_deadline: "",
    location: "",
    capacity: "",
    event_type: "offline",
    skills_offered: [],
    topics: [],
    media_links: [], // optional links, keep as strings
  });

  // Single required image file (not a link)
  const [eventImageFile, setEventImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  // Fetch clubs on component mount
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoadingClubs(true);
        const response = await axiosInstance.get('/clubs', {
          params: { limit: 100 } // Get up to 100 clubs
        });
        setClubs(response.data.results || []);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
        setErrors(prev => ({ ...prev, clubs: 'Failed to load clubs' }));
      } finally {
        setLoadingClubs(false);
      }
    };

    fetchClubs();
  }, []);

  const skillsList = SKILLS_ENUM_FALLBACK;

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleSkill = (skill) => {
    setForm((f) => {
      const exists = f.skills_offered.includes(skill);
      return {
        ...f,
        skills_offered: exists
          ? f.skills_offered.filter((s) => s !== skill)
          : [...f.skills_offered, skill],
      };
    });
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setEventImageFile(null);
      setImagePreview("");
      return;
    }
    setEventImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.event_description.trim()) e.event_description = "Description is required";
    if (!form.category) e.category = "Select a category";
    if (!form.club_hosting) {
      e.club_hosting = "Select a host club";
    } else if (!/^[0-9a-fA-F]{24}$/.test(form.club_hosting)) {
      e.club_hosting = "Invalid club ID format";
    }
    if (!form.event_date) e.event_date = "Pick a date";
    if (!form.event_time_duration.trim()) e.event_time_duration = "Add time/duration info";
    if (!form.registration_deadline) e.registration_deadline = "Pick a registration deadline";
    if (!form.location.trim()) e.location = "Location is required";
    if (form.capacity === "" || Number(form.capacity) < 1) e.capacity = "Capacity must be ≥ 1";
    if (!form.event_type) e.event_type = "Choose an event format";
    if (!eventImageFile) e.event_image = "Event image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Since the server expects event_image as a URL string, we'll use a placeholder
      // In a real implementation, you would upload the image to cloudinary first
      // and get the URL, then use that URL
      const imageUrl = eventImageFile 
        ? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=60" 
        : "";

      // Prepare event data according to server validation schema
      const eventData = {
        title: form.title,
        event_description: form.event_description,
        category: form.category,
        event_image: imageUrl,
        club_hosting: form.club_hosting,
        event_date: form.event_date,
        event_time_duration: form.event_time_duration,
        registration_deadline: form.registration_deadline,
        location: form.location,
        capacity: parseInt(form.capacity) || 1,
        event_type: form.event_type,
        skills_offered: form.skills_offered,
        topics: form.topics,
        media_links: form.media_links,
        // event_status is not included - server will default to 'unpublished'
      };

      console.log('Submitting event data:', eventData); // Debug log to verify data
      
      const res = await axiosInstance.post('/events', eventData);

      navigate(`/events/${res.data._id || res.data.id}`, { state: { event: res.data } });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create event";
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0b1220] py-10 text-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-300 via-white to-violet-300 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
              <BookmarkPlus className="h-7 w-7 text-indigo-300" />
              Create Event
            </h1>
            <p className="mt-2 text-slate-400">Fill the details below to publish your event.</p>
          </div>
          <Sparkles className="hidden md:block h-8 w-8 text-indigo-400/60" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr),420px]">
          {/* Form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6"
          >
            {/* Title + Description */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="e.g., Startup Pitch Competition"
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 ${
                    errors.title ? "border-rose-500" : "border-slate-700/60"
                  }`}
                />
                {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold">Description *</label>
                <textarea
                  rows={5}
                  value={form.event_description}
                  onChange={(e) => setField("event_description", e.target.value)}
                  placeholder="Tell attendees what to expect…"
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 ${
                    errors.event_description ? "border-rose-500" : "border-slate-700/60"
                  }`}
                />
                {errors.event_description && (
                  <p className="mt-1 text-xs text-rose-400">{errors.event_description}</p>
                )}
              </div>
            </div>

            {/* Image Upload (required) */}
            <div>
              <label className="mb-1 block text-sm font-semibold">Event Image *</label>
              <div className={`rounded-xl border ${errors.event_image ? "border-rose-500" : "border-slate-700/60"} bg-slate-900/60 p-4`}>
                <div className="flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700/60 px-4 py-2 hover:bg-slate-800/60">
                    <Upload className="h-4 w-4 text-indigo-300" />
                    <span className="text-sm">Choose file</span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={onPickImage}
                    />
                  </label>
                  <span className="truncate text-xs text-slate-400">
                    {eventImageFile ? eventImageFile.name : "No file selected"}
                  </span>
                </div>
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-40 w-full rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
              {errors.event_image && (
                <p className="mt-1 text-xs text-rose-400">{errors.event_image}</p>
              )}
            </div>

            {/* Category / Club */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 ${
                    errors.category ? "border-rose-500" : "border-slate-700/60"
                  }`}
                >
                  <option value="">Select</option>
                  {CATEGORIES.map((c, index) => (
                    <option key={`category-${index}-${c}`} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-rose-400">{errors.category}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Hosting Club *</label>
                <select
                  value={form.club_hosting}
                  onChange={(e) => setField("club_hosting", e.target.value)}
                  disabled={loadingClubs}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.club_hosting ? "border-rose-500" : "border-slate-700/60"
                  }`}
                >
                  <option value="">
                    {loadingClubs ? "Loading clubs..." : "Select a club"}
                  </option>
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (ID: {c.id})
                    </option>
                  ))}
                </select>
                {errors.club_hosting && (
                  <p className="mt-1 text-xs text-rose-400">{errors.club_hosting}</p>
                )}
                {errors.clubs && (
                  <p className="mt-1 text-xs text-rose-400">{errors.clubs}</p>
                )}
              </div>
            </div>

            {/* Dates / Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  <CalendarDays className="mr-1 inline h-4 w-4 text-indigo-300" />
                  Event Date *
                </label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setField("event_date", e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 ${
                    errors.event_date ? "border-rose-500" : "border-slate-700/60"
                  }`}
                />
                {errors.event_date && (
                  <p className="mt-1 text-xs text-rose-400">{errors.event_date}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  <Clock className="mr-1 inline h-4 w-4 text-indigo-300" />
                  Time & Duration (text) *
                </label>
                <input
                  value={form.event_time_duration}
                  onChange={(e) => setField("event_time_duration", e.target.value)}
                  placeholder='e.g., "10:00 – 12:00 (120m)"'
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 ${
                    errors.event_time_duration ? "border-rose-500" : "border-slate-700/60"
                  }`}
                />
                {errors.event_time_duration && (
                  <p className="mt-1 text-xs text-rose-400">{errors.event_time_duration}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  value={form.registration_deadline}
                  onChange={(e) => setField("registration_deadline", e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 ${
                    errors.registration_deadline ? "border-rose-500" : "border-slate-700/60"
                  }`}
                />
                {errors.registration_deadline && (
                  <p className="mt-1 text-xs text-rose-400">{errors.registration_deadline}</p>
                )}
              </div>
            </div>

            {/* Location / Capacity / Type */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold">
                  <MapPin className="mr-1 inline h-4 w-4 text-indigo-300" />
                  Location *
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="e.g., Main Auditorium"
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 ${
                    errors.location ? "border-rose-500" : "border-slate-700/60"
                  }`}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-rose-400">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  <Users className="mr-1 inline h-4 w-4 text-indigo-300" />
                  Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => setField("capacity", e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 ${
                    errors.capacity ? "border-rose-500" : "border-slate-700/60"
                  }`}
                />
                {errors.capacity && (
                  <p className="mt-1 text-xs text-rose-400">{errors.capacity}</p>
                )}
              </div>
            </div>

            {/* Event Type */}
            <div>
              <label className="mb-1 block text-sm font-semibold">Event Type *</label>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((t, index) => (
                  <Chip
                    key={`event-type-${index}-${t}`}
                    selected={form.event_type === t}
                    onClick={() => setField("event_type", t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
              {errors.event_type && (
                <p className="mt-1 text-xs text-rose-400">{errors.event_type}</p>
              )}
            </div>

            {/* Skills Offered */}
            <div>
              <label className="mb-2 block text-sm font-semibold">Skills Offered</label>
              <div className="space-y-3">
                {/* Technical Skills */}
                <div>
                  <h4 className="mb-2 text-xs font-medium text-slate-400 uppercase tracking-wide">Technical</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.slice(0, 16).map((s, index) => (
                      <Chip
                        key={`skill-${index}-${s}`}
                        selected={form.skills_offered.includes(s)}
                        onClick={() => toggleSkill(s)}
                      >
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
                
                {/* Professional & Career */}
                <div>
                  <h4 className="mb-2 text-xs font-medium text-slate-400 uppercase tracking-wide">Professional & Career</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.slice(16, 26).map((s, index) => (
                      <Chip
                        key={`skill-${index + 16}-${s}`}
                        selected={form.skills_offered.includes(s)}
                        onClick={() => toggleSkill(s)}
                      >
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
                
                {/* Creative & Cultural */}
                <div>
                  <h4 className="mb-2 text-xs font-medium text-slate-400 uppercase tracking-wide">Creative & Cultural</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.slice(26, 37).map((s, index) => (
                      <Chip
                        key={`skill-${index + 26}-${s}`}
                        selected={form.skills_offered.includes(s)}
                        onClick={() => toggleSkill(s)}
                      >
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
                
                {/* Business & Other */}
                <div>
                  <h4 className="mb-2 text-xs font-medium text-slate-400 uppercase tracking-wide">Business & Others</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.slice(37).map((s, index) => (
                      <Chip
                        key={`skill-${index + 37}-${s}`}
                        selected={form.skills_offered.includes(s)}
                        onClick={() => toggleSkill(s)}
                      >
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Topics <Hash className="ml-1 inline h-4 w-4 text-indigo-300" />
              </label>
              <TagInput
                value={form.topics}
                onChange={(v) => setField("topics", v)}
                placeholder="Add a topic and press Enter"
              />
            </div>

            {/* Media Links (optional) */}
            <div>
              <label className="mb-1 block text-sm font-semibold">Media Links (optional)</label>
              <SmallListEditor
                value={form.media_links}
                onChange={(v) => setField("media_links", v)}
                placeholder="https://example.com/photo-or-video"
              />
            </div>

            {errors.submit && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-900/20 p-3 text-sm text-rose-200">
                {errors.submit}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/events")}
                className="rounded-xl border border-slate-700/60 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || loadingClubs}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:from-indigo-500 hover:to-violet-600 disabled:opacity-60"
              >
                {submitting ? "Creating..." : loadingClubs ? "Loading..." : "Create Event"}
              </button>
            </div>
          </motion.form>

          {/* Live Preview Card */}
          <motion.aside
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="md:sticky md:top-8"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 shadow-lg">
              <div className="h-44 w-full overflow-hidden">
                <img
                  src={
                    imagePreview ||
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=60"
                  }
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-lg font-bold">
                  {form.title || "Your Event Title"}
                </h3>
                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-indigo-300" />
                    <span>
                      {form.event_date || "YYYY-MM-DD"} • {form.event_time_duration || "time/duration"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-300" />
                    <span>{form.location || "Location"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-300" />
                    <span>{form.capacity || 0} capacity</span>
                  </div>
                  {form.club_hosting && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-300">🏛️</span>
                      <span>{clubs.find(c => c.id === form.club_hosting)?.name || "Selected Club"}</span>
                    </div>
                  )}
                </div>
                {(form.category || form.event_type) && (
                  <div className="mt-3 space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-1 text-xs font-semibold text-white">
                      {form.category || "Category"}
                      <span className="opacity-80">•</span>
                      {form.event_type}
                    </div>
                    <div className="block">
                      <span className="inline-flex items-center gap-1 rounded-md bg-yellow-600/20 border border-yellow-600/30 px-2 py-1 text-xs font-medium text-yellow-200">
                        📝 Will be created as &ldquo;unpublished&rdquo;
                      </span>
                    </div>
                  </div>
                )}
                {form.event_description && (
                  <p className="mt-3 line-clamp-3 text-sm text-slate-300">
                    {form.event_description}
                  </p>
                )}
                {form.skills_offered.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.skills_offered.slice(0, 5).map((s, index) => (
                      <span
                        key={`preview-skill-${index}-${s}`}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px]"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <style>{`
              .line-clamp-2{-webkit-line-clamp:2;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
              .line-clamp-3{-webkit-line-clamp:3;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
            `}</style>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Small editor ------------------------------ */
function SmallListEditor({ value, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...(value || []), v]);
    setDraft("");
  };

  const remove = (i) => {
    const next = [...(value || [])];
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 space-y-2">
        {(value || []).map((u, i) => (
          <div
            key={`${u}-${i}`}
            className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm"
          >
            <a
              href={u}
              target="_blank"
              rel="noreferrer"
              className="truncate underline decoration-slate-500 hover:text-indigo-300"
            >
              {u}
            </a>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-200"
              onClick={() => remove(i)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? (e.preventDefault(), add()) : null)}
          className="flex-1 rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

SmallListEditor.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
