"use client";

import { useState } from "react";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
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
    } catch (error) {
      console.error(error);
    }

    setUploading(false);
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold tracking-wide">JobRadar AI</div>

        <button className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/10">
          Sign in
        </button>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2">
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
      </section>
    </main>
  );
}