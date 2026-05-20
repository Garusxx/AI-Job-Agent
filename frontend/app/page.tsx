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
  roles: {
    title: string;
    company: string | null;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
  }[];
};

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

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

      console.log(data);

      setProfile(data.profile);
    } catch (error) {
      console.error(error);
    }

    setUploading(false);
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
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Upload Another CV
                </button>
              </div>

              <p className="mt-8 text-lg leading-8 text-slate-300">
                {profile.summary}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
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

                  <p className="mt-2 text-lg font-semibold">{profile.email}</p>
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
                      key={role.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {role.title}
                          </h3>

                          <p className="text-cyan-300">
                            {role.company || "Independent"}
                          </p>
                        </div>

                        <div className="text-sm text-slate-400">
                          {role.start_date} — {role.end_date}
                        </div>
                      </div>

                      <p className="mt-4 leading-7 text-slate-300">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
