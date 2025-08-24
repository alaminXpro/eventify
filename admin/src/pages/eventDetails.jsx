// src/pages/AdminEventDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosInstance";

export default function AdminEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch event data
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`, { signal: controller.signal });
        if (!ignore) setEvent(res.data);
      } catch (e) {
        if (!ignore) setError("Event not found");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; controller.abort(); };
  }, [id]);

  if (loading) return <p className="text-slate-300 p-6">Loading event...</p>;
  if (error || !event)
    return (
      <div className="p-6 text-red-400">
        <p>{error || "Event not found"}</p>
        <button onClick={() => navigate("/admin/events")} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
          Back to Events
        </button>
      </div>
    );

  return (
    <section className="p-6 bg-[#0b1220] min-h-screen text-slate-100">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Event Image */}
        {event.event_image && (
          <img src={event.event_image} alt={event.title} className="w-full h-60 object-cover rounded-xl" />
        )}

        {/* Title & Status */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <span className={`px-3 py-1 rounded-full font-semibold ${event.event_status === "published" ? "bg-green-600" : "bg-gray-500"}`}>
            {event.event_status}
          </span>
        </div>

        {/* Basic Details */}
        <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
          <div><strong>Category:</strong> {event.category?.name || "N/A"}</div>
          <div><strong>Type:</strong> {event.event_type?.name || "N/A"}</div>
          <div><strong>Club Hosting:</strong> {event.club_hosting?.name || "N/A"}</div>
          <div><strong>Capacity:</strong> {event.total_registrations || 0} / {event.event_time_duration || "N/A"}</div>
          <div><strong>Event Date:</strong> {event.event_date ? new Date(event.event_date).toLocaleDateString() : "N/A"}</div>
          <div><strong>Duration:</strong> {event.event_time_duration || "N/A"}</div>
          <div><strong>Location:</strong> {event.location || "N/A"}</div>
          <div><strong>Registration Deadline:</strong> {event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString() : "N/A"}</div>
          <div><strong>Unique Attendees:</strong> {event.unique_attendees || 0}</div>
          <div><strong>View Count:</strong> {event.view || 0}</div>
          <div><strong>Created At:</strong> {event.created_at ? new Date(event.created_at).toLocaleString() : "N/A"}</div>
          <div><strong>Updated At:</strong> {event.updated_at ? new Date(event.updated_at).toLocaleString() : "N/A"}</div>
        </div>

        {/* Skills Offered */}
        {event.skills_offered?.length > 0 && (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
            <h2 className="font-semibold mb-2">Skills Offered</h2>
            <ul className="list-disc pl-6">
              {event.skills_offered.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        )}

        {/* Topics */}
        {event.topics?.length > 0 && (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
            <h2 className="font-semibold mb-2">Topics</h2>
            <ul className="list-disc pl-6">
              {event.topics.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          </div>
        )}

        {/* Description */}
        {event.event_description && (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
            <h2 className="font-semibold mb-2">Description</h2>
            <p>{event.event_description}</p>
          </div>
        )}

      </div>
    </section>
  );
}
