import React, { useEffect, useState } from "react";
import { useSelector /*, useDispatch*/ } from "react-redux";
import axios from "axios";
import { MapPin, GraduationCap, Briefcase, Globe } from "lucide-react";
// TODO: BACKEND (Redux actions)

export default function Profile() {
    const API_BASE = import.meta.env.VITE_API_BASE;


    const userFromRedux = useSelector((state) => state?.user?.user);

    // Local state to hold user (fallback to demo until wired)
    const [user, setUser] = useState(
        userFromRedux || {
            // DEMO DATA (remove once wired)
            name: "Alex Student",
            email: "alex@student.edu",
            department: "CSE",
            semester: "3.2",
            studentId: "2023001",
            bio: "Enthusiastic learner, passionate about hackathons & AI research.",
            profession: "Student Developer",
            skills: ["JavaScript", "Python", "React", "Node.js"],
            phone: "+880123456789",
            address: "Dhaka, Bangladesh",
            website: "https://alexstudent.dev",
            linkedin: "https://linkedin.com/in/alexstudent",
            github: "https://github.com/alexstudent",
            avatar:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }
    );

    // const dispatch = useDispatch(); // TODO: BACKEND (if you want to use Redux actions inside this page)

    useEffect(() => {
        // If Redux already has user, use it and skip fetch
        if (userFromRedux) {
            setUser(userFromRedux);
            return;
        }

        /* 
           TODO: BACKEND — Fetch current user profile
        */
        let active = true;
        (async () => {
            try {
                // dispatch(fetchUserStart()); // (optional) if using Redux actions

            } catch (err) {
                // dispatch(fetchUserFailure(err?.response?.data?.message || "Failed to load profile")); // (optional)
            }
        })();

        return () => {
            active = false;
        };
    }, [API_BASE, userFromRedux /*, dispatch*/]);

    /* 
       TODO: BACKEND — Avatar Upload / Profile Edit
    */

    return (
        <section className="min-h-screen bg-[#0b1220] text-slate-100 py-10">
            <div className="mx-auto max-w-4xl px-6">
                <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 shadow-lg">
                    {/* Cover */}
                    <div className="h-40 bg-gradient-to-r from-indigo-600 to-violet-600" />

                    {/* Header */}
                    <div className="-mt-12 flex items-end gap-4 px-6">
                        {/* Avatar (replace with real user.avatar) */}
                        <img
                            src={user?.avatar}
                            alt={user?.name || "avatar"}
                            className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#0b1220]"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">{user?.name || "—"}</h1>
                            <p className="text-slate-400">{user?.email || "—"}</p>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="px-6 pb-6 mt-6 space-y-6">
                        {user?.bio && <p className="text-slate-300">{user.bio}</p>}

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
                                icon={<Briefcase className="h-4 w-4" />}
                            />
                            <InfoCard
                                label="Address"
                                value={user?.address}
                                icon={<MapPin className="h-4 w-4" />}
                            />
                        </div>

                        {/* Skills */}
                        {Array.isArray(user?.skills) && user.skills.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400">Skills</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {user.skills.map((s) => (
                                        <span
                                            key={s}
                                            className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-indigo-300"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        {(user?.website || user?.linkedin || user?.github) && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400">Links</h3>
                                <ul className="mt-2 space-y-1 text-sm">
                                    {user?.website && (
                                        <li>
                                            <a
                                                href={user.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-400 hover:underline flex items-center gap-2"
                                            >
                                                <Globe className="h-4 w-4" /> Website
                                            </a>
                                        </li>
                                    )}
                                    {user?.linkedin && (
                                        <li>
                                            <a
                                                href={user.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-400 hover:underline"
                                            >
                                                LinkedIn
                                            </a>
                                        </li>
                                    )}
                                    {user?.github && (
                                        <li>
                                            <a
                                                href={user.github}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-400 hover:underline"
                                            >
                                                GitHub
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* 
              TODO: BACKEND — Add an "Edit Profile" CTA:
            */}
                    </div>
                </div>
            </div>
        </section>
    );
}

function InfoCard({ label, value, icon }) {
    return (
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                {icon}
                {label}
            </div>
            <div className="mt-1 text-slate-100">{value || "—"}</div>
        </div>
    );
}
