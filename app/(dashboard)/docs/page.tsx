// app/(dashboard)/docs/page.tsx
"use client";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10 text-gray-900"
    >
      {/* HEADER */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Resume Analyzer Docs</h1>
        <p className="text-gray-600">
          AI-powered Resume Analyzer SaaS using Next.js, Node.js, Cloudinary, and local LLM (Phi-3 via Ollama).
        </p>
      </div>

      {/* GITHUB LINKS */}
      <div className="border p-6 rounded-xl space-y-2">
        <h2 className="text-xl font-semibold">Repositories</h2>
        <p>
          Frontend:{" "}
          <a href="https://github.com/your-username/resume-analyzer-client" className="underline">
            GitHub Repo
          </a>
        </p>
        <p>
          Backend:{" "}
          <a href="https://github.com/your-username/resume-analyzer-server" className="underline">
            GitHub Repo
          </a>
        </p>
      </div>

      {/* SYSTEM ARCHITECTURE */}
      <div className="border p-6 rounded-xl space-y-3">
        <h2 className="text-xl font-semibold">System Architecture</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`Client (Next.js)
   │
   ▼
Express Backend
   ├── Auth Routes (/auth)
   ├── Resume Routes (/resume)
   │       ├── Multer (file upload)
   │       ├── Cloudinary (storage)
   │       ├── PDF Parser
   │       └── LLM Analysis Engine
   │
   ▼
PostgreSQL (Prisma ORM)
`}
        </pre>
      </div>

      {/* ANALYSIS ENGINE */}
      <div className="border p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Analysis Engine (Core)</h2>

        <p>
          The analysis engine is the core of this system. It processes parsed resume text and optional job descriptions
          using a hybrid architecture:
        </p>

        <ul className="list-disc ml-5 space-y-1">
          <li>Resume uploaded → stored on Cloudinary</li>
          <li>Text extracted from PDF</li>
          <li>Prompt constructed with resume + job description</li>
          <li>Sent to local LLM (Phi-3 mini via Ollama)</li>
          <li>Returns structured ATS analysis</li>
        </ul>

        <div className="bg-gray-100 p-4 rounded text-sm">
          <p className="font-semibold mb-2">Why Local LLM (Phi-3)?</p>
          <ul className="list-disc ml-5">
            <li>No API cost</li>
            <li>Full data privacy</li>
            <li>Fast local inference</li>
            <li>Docker-compatible deployment</li>
          </ul>
        </div>
      </div>

      {/* SCORING MODEL */}
      <div className="border p-6 rounded-xl space-y-3">
        <h2 className="text-xl font-semibold">Scoring Model</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <span>ATS Score</span>
          <span>Keyword Score</span>
          <span>Section Score</span>
          <span>Skill Score</span>
          <span>Structure Score</span>
          <span>Semantic Score</span>
          <span>Experience Score</span>
          <span>Impact Score</span>
        </div>
      </div>

      {/* API ROUTES */}
      <div className="border p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">API Routes</h2>

        <div>
          <h3 className="font-semibold">Auth</h3>
          <ul className="list-disc ml-5 text-sm">
            <li>POST /auth/register</li>
            <li>POST /auth/verify-email</li>
            <li>POST /auth/login</li>
            <li>POST /auth/forgot-password</li>
            <li>POST /auth/reset-password</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Resume</h3>
          <ul className="list-disc ml-5 text-sm">
            <li>POST /resume/upload</li>
            <li>GET /resume/</li>
            <li>GET /resume/:id</li>
            <li>POST /resume/:id/analyze</li>
          </ul>
        </div>
      </div>

      {/* FLOW */}
      <div className="border p-6 rounded-xl space-y-3">
        <h2 className="text-xl font-semibold">Flow</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
{`Register → Verify OTP → Login → Upload Resume → Analyze → Get Insights`}
        </pre>
      </div>

      {/* EXAMPLE RESPONSE */}
      <div className="border p-6 rounded-xl space-y-3">
        <h2 className="text-xl font-semibold">Analysis Response</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
{`{
  "atsScore": 66.09,
  "keywordScore": 66.67,
  "sectionScore": 100,
  "skillScore": 47.06,
  "structureScore": 100,
  "semanticScore": 0,
  "experienceScore": 92,
  "impactScore": 95,
  "suggestions": {
    "rewriteTips": [...],
    "suggestions": [...],
    "missingKeywords": [...]
  }
}`}
        </pre>
      </div>

      {/* BACKEND REF */}
      <div className="border p-6 rounded-xl">
        <p className="text-sm text-gray-600">
          Backend reference: Check the backend repository for implementation details
        </p>
      </div>
    </motion.div>
  );
}