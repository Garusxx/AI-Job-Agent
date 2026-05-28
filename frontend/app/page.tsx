"use client";

import { useState } from "react";

type CandidateProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  technologies: string[];
  seniority: string;
  years_of_experience: string;
  recommended_search_role: string;
  roles: {
    title: string;
    company: string | null;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
  }[];
};

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  created_at: string;
};

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [searching, setSearching] = useState(false);
  const [targetRole, setTargetRole] = useState("Full Stack Developer");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload-cv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setProfile(data.profile);
      setTargetRole(
        data.profile.recommended_search_role || "Full Stack Developer",
      );
    } catch (error) {
      console.error(error);
    }

    setUploading(false);
  }

  async function searchJobs() {
    setSearching(true);

    try {
      const response = await fetch(
        `http://localhost:8000/live-jobs/search?q=${encodeURIComponent(targetRole)}`,
      );

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }

    setSearching(false);
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold tracking-wide">JobRadar AI</div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        {!profile && (
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur">
                AI-powered job search assistant
              </div>

              <h1 className="max-w-2xl text-5xl font-bold tracking-tight md:text-7xl">
                Find jobs that actually match your CV.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Upload your CV and let AI understand your experience, skills and
                preferences.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400 text-3xl text-slate-950 shadow-lg shadow-cyan-500/30">
                  📄
                </div>

                <h2 className="text-2xl font-bold">Upload your CV</h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-300">
                  PDF, DOC or DOCX
                </p>

                <label className="mt-8 inline-flex cursor-pointer rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300">
                  {uploading ? "Uploading..." : "Choose file"}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>

                {fileName && (
                  <p className="mt-4 text-sm text-cyan-300">
                    Uploaded: {fileName}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {profile && (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-cyan-300">
                    AI Candidate Profile
                  </p>

                  <h1 className="mt-2 text-4xl font-bold">{profile.name}</h1>

                  <p className="mt-2 text-slate-300">{profile.location}</p>
                </div>

                <button
                  onClick={() => {
                    setProfile(null);
                    setFileName("");
                    setJobs([]);
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  New CV
                </button>
              </div>

              <p className="mt-8 text-base leading-8 text-slate-300">
                {profile.summary}
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Seniority</p>
                  <p className="mt-2 text-lg font-semibold">
                    {profile.seniority}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Experience</p>
                  <p className="mt-2 text-lg font-semibold">
                    {profile.years_of_experience}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="mt-2 break-words text-lg font-semibold">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold">Skills</h2>

                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold">Work Experience</h2>

                <div className="space-y-4">
                  {profile.roles.map((role) => (
                    <div
                      key={`${role.title}-${role.company}-${role.start_date}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h3 className="text-lg font-semibold">{role.title}</h3>

                      <p className="mt-1 text-cyan-300">
                        {role.company || "Independent"}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {role.start_date} — {role.end_date}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-slate-300">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div>
                <p className="text-sm uppercase tracking-wide text-cyan-300">
                  Job Search
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  Find matching offers
                </h2>

                <p className="mt-4 text-slate-300">
                  AI selected the best search role from your CV. You can edit it
                  before searching..
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 md:flex-row">
                <input
                  type="text"
                  placeholder="React, Python, Full Stack..."
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500"
                />

                <button
                  onClick={searchJobs}
                  disabled={searching}
                  className="rounded-2xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {jobs.map((job, index) => (
                  <div
                    key={`${job.title}-${job.company}-${job.location}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="mt-1 text-cyan-300">{job.company}</p>
                      </div>

                      <p className="text-sm text-slate-400">{job.location}</p>
                    </div>

                    <p className="mt-4 leading-7 text-slate-300">
                      {job.description}
                    </p>

                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                      >
                        View job →
                      </a>
                    )}
                  </div>
                ))}

                {jobs.length === 0 && targetRole && !searching && (
                  <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                    No jobs found yet.
                  </p>
                )}

                {jobs.length === 0 && !targetRole && (
                  <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                    Enter a skill or role to search jobs.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
