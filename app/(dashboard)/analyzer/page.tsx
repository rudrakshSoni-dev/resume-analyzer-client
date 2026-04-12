"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import api from '../../lib/axios';
import { Analysis } from '../../types';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showJD, setShowJD] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Analysis | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const router = useRouter();

  // ================= UPLOAD =================
  const uploadFile = async (uploadedFile: File) => {
    if (uploading) return;

    setUploading(true);
    setFile(uploadedFile);
    setResumeId('');
    setResults(null);

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const { data } = await api.post('/resume/upload', formData);

      if (!data?.id) {
        throw new Error("No ID returned from backend");
      }

      setResumeId(data.id);
      toast.success('Resume uploaded successfully');
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);

      setFile(null);
      setResumeId('');

      toast.error('Upload failed', {
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Server error',
      });
    } finally {
      setUploading(false);
    }
  };

  // ================= DROP =================
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (uploading) return;

    const uploadedFile = e.dataTransfer.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== 'application/pdf') {
      toast.error('Only PDF allowed');
      return;
    }

    uploadFile(uploadedFile);
  };

  // ================= FILE SELECT =================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading) return;

    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== 'application/pdf') {
      toast.error('Only PDF allowed');
      return;
    }

    uploadFile(uploadedFile);
  };

  // ================= MOCK =================
  const handleMockResume = async () => {
    if (uploading) return;

    try {
      const res = await fetch('/resume.pdf');
      const blob = await res.blob();

      const mockFile = new File([blob], 'resume.pdf', {
        type: 'application/pdf',
      });

      await uploadFile(mockFile);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load mock resume');
    }
  };

  // ================= ANALYZE =================
  const handleAnalyze = async () => {
    if (!resumeId) {
      toast.error('Upload a resume first');
      return;
    }

    setAnalyzing(true);

    try {
      const payload: any = {};

      // ✅ Only send JD if valid
      if (jobDescription && jobDescription.trim().length >= 10) {
        payload.jobDescription = jobDescription.trim();
      }

      const { data } = await api.post(
        `/resume/${resumeId}/analyze`,
        payload
      );

      if (!data?.analysis) {
        throw new Error('Invalid analysis response');
      }

      setResults(data.analysis);

      sessionStorage.setItem(
        'missingKeywords',
        data.analysis.suggestions.missingKeywords
          .slice(0, 5)
          .join(' ')
      );

      toast.success('Analysis complete');
    } catch (err: any) {
      console.error(err);

      const msg =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.message ||
        'Analysis failed';

      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const scores = results
    ? [
        { name: 'Keyword Match', score: results.keywordScore },
        { name: 'Section Check', score: results.sectionScore },
        { name: 'Skill Gap', score: results.skillScore },
        { name: 'Formatting', score: results.structureScore },
        { name: 'Semantics', score: results.semanticScore },
        { name: 'Experience', score: results.experienceScore },
        { name: 'Impact metrics', score: results.impactScore },
      ]
    : [];

  const isJDValid =
    !jobDescription || jobDescription.trim().length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* DROPZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!uploading)
            document.getElementById('fileInput')?.click();
        }}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all
        ${dragActive ? 'border-black bg-gray-100' : 'border-gray-300 bg-white hover:border-black'}
        ${uploading ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      >
        {uploading ? (
          <>
            <UploadCloud className="w-12 h-12 animate-pulse mb-4" />
            <p>Uploading...</p>
          </>
        ) : file && resumeId ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-green-600">Ready to analyze</p>

            <Button
              variant="outline"
              className="mt-3"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setResumeId('');
                setResults(null);
              }}
            >
              Upload another
            </Button>
          </>
        ) : (
          <>
            <UploadCloud className="w-12 h-12 mb-4" />
            <p>Drag & drop or click to upload PDF</p>
            <p className="text-sm mt-2">
              or use{' '}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleMockResume();
                }}
                className="underline cursor-pointer"
              >
                mock resume
              </span>
            </p>
          </>
        )}

        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* JD */}
      <div className="bg-white p-4 border rounded-xl">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setShowJD(!showJD)}
        >
          <span>Add Job Description (Optional)</span>
          {showJD ? <ChevronUp /> : <ChevronDown />}
        </div>

        {showJD && (
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Minimum 10 characters..."
            className="w-full mt-4 p-3 border rounded-md h-32"
          />
        )}
      </div>

      {/* ANALYZE */}
      <Button
        onClick={handleAnalyze}
        disabled={!resumeId || uploading || analyzing || !isJDValid}
        className="w-full bg-black text-white py-6"
      >
        {uploading
          ? 'Uploading...'
          : analyzing
          ? 'Analyzing...'
          : 'Analyze Resume'}
      </Button>

      {/* LOADING */}
      {analyzing && (
        <div className="flex justify-center">
          <Skeleton className="w-48 h-48 rounded-full" />
        </div>
      )}

      {/* RESULTS */}
      {results && !analyzing && (
        <div className="space-y-6">
          <div className="bg-white p-6 border rounded-xl">
            <h3>ATS Score</h3>
            <div className="text-4xl font-bold">
              {results.atsScore}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {scores.map((s, i) => (
              <div key={i} className="bg-white p-4 border rounded">
                <div className="flex justify-between">
                  <span>{s.name}</span>
                  <span>{s.score}</span>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => router.push('/jobs')}
            className="w-full bg-black text-white"
          >
            Find Jobs <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}