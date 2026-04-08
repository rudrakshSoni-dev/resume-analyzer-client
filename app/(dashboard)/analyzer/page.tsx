"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UploadCloud, ChevronDown, ChevronUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../../lib/axios';
import { Analysis } from '../../types';
import { toast } from 'sonner'; // <-- Ensure sonner is imported
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJD, setShowJD] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Analysis | null>(null);

  const router = useRouter();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile?.type !== 'application/pdf') {
      // Correct Sonner error toast syntax
      toast.error('Invalid format', { 
        description: 'Please upload a PDF' 
      });
      return;
    }
    setFile(uploadedFile);
    
    // Upload File
    const formData = new FormData();
    formData.append('resume', uploadedFile);
    try {
      const { data } = await api.post('/resume/upload', formData);
      setResumeId(data.resumeId);
      // Correct Sonner success toast syntax
      toast.success('Success', { 
        description: 'Resume uploaded' 
      });
    } catch (err: any) {
      // Correct Sonner error toast syntax
      toast.error('Upload failed', { 
        description: err.message || 'Something went wrong'
      });
    }
  };

  const handleAnalyze = async () => {
    if (!resumeId) return;
    setAnalyzing(true);
    try {
      const { data } = await api.post(`/resume/${resumeId}/analyze`, { jobDescription });
      setResults(data.analysis);
      sessionStorage.setItem('missingKeywords', data.analysis.suggestions.missingKeywords.slice(0, 5).join(' '));
    } catch (err: any) {
      // Correct Sonner error toast syntax
      toast.error('Analysis failed', {
        description: 'There was an issue analyzing the resume.'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const scores = results ? [
    { name: 'Keyword Match', score: results.keywordScore },
    { name: 'Section Check', score: results.sectionScore },
    { name: 'Skill Gap', score: results.skillScore },
    { name: 'Formatting', score: results.structureScore },
    { name: 'Semantics', score: results.semanticScore },
    { name: 'Experience', score: results.experienceScore },
    { name: 'Impact metrics', score: results.impactScore },
  ] : [];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-3xl mx-auto space-y-8">
      
      {/* Dropzone */}
      <div 
        onDragOver={(e) => e.preventDefault()} 
        onDrop={handleDrop} 
        className="border-2 border-dashed border-gray-300 bg-white rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-linkedin-primary transition-colors"
      >
        <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-700 font-medium">{file ? file.name : 'Drag & drop your PDF resume here'}</p>
        <p className="text-sm text-gray-500 mt-2">or use our <a href="/mock-resume.pdf" download className="text-linkedin-primary hover:underline" onClick={e => e.stopPropagation()}>mock resume</a></p>
      </div>

      {/* Optional JD */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowJD(!showJD)}>
          <span className="text-gray-700 font-medium">Add a Job Description (Optional)</span>
          {showJD ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {showJD && (
          <textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here to improve semantic scoring..."
            className="w-full mt-4 p-3 border rounded-md text-sm h-32 focus:outline-none focus:ring-1 focus:ring-linkedin-primary"
          />
        )}
      </div>

      <Button onClick={handleAnalyze} disabled={!resumeId || analyzing} className="w-full bg-linkedin-primary hover:bg-linkedin-primary/90 py-6 text-lg">
        {analyzing ? 'Analyzing...' : 'Analyze Resume'}
      </Button>

      {/* Skeletons while loading */}
      {analyzing && (
        <div className="space-y-6">
          <div className="flex justify-center"><Skeleton className="w-48 h-48 rounded-full" /></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        </div>
      )}

      {/* Results */}
      {results && !analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
          
          {/* ATS Ring */}
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Overall ATS Score</h3>
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-gray-200 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                <motion.circle 
                  className={`${results.atsScore > 75 ? 'text-green-500' : results.atsScore > 50 ? 'text-yellow-500' : 'text-red-500'} stroke-current`}
                  strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * results.atsScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.circle>
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gray-800">
                {results.atsScore}
              </div>
            </div>
          </div>

          {/* 8-Dimension Grid */}
          <motion.div variants={{ animate: { transition: { staggerChildren: 0.07 } } }} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scores.map((s, i) => (
              <motion.div key={i} variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between mb-2"><span className="text-sm font-medium text-gray-700">{s.name}</span><span className="text-sm font-bold text-gray-900">{s.score}/100</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div className="bg-linkedin-accent h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1, type: "spring" }} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Suggestions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Improvement Tips</h3>
            <ul className="space-y-3 mb-6">
              {results.suggestions.rewriteTips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600"><CheckCircle2 className="w-5 h-5 text-linkedin-primary flex-shrink-0" /> {tip}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {results.suggestions.missingKeywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 text-xs border border-linkedin-primary text-linkedin-primary rounded-full bg-linkedin-primary/5">{kw}</span>
              ))}
            </div>
          </div>

          <Button onClick={() => router.push('/jobs')} className="w-full bg-linkedin-dark hover:bg-gray-800 py-6 text-lg flex items-center justify-center gap-2">
            Find Matching Jobs <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}