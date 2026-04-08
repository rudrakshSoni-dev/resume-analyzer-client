"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Building2, Search } from 'lucide-react';
import { AdzunaJob } from '../../types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Skeleton } from '../../../components/ui/skeleton';

export default function JobsPage() {
  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState('');

  const fetchJobs = async (searchParams: string) => {
    setLoading(true);
    try {
      const appId = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
      const appKey = process.env.NEXT_PUBLIC_ADZUNA_APP_KEY;
      const res = await fetch(`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(searchParams)}&results_per_page=10`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setJobs(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('missingKeywords') || 'software engineer';
    setKeywords(stored);
    fetchJobs(stored);
  }, []);

  const handleSearch = () => fetchJobs(keywords);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-4xl mx-auto">
      
      <div className="flex gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Skills, Keywords, Job Title..." className="flex-1" />
        <Button onClick={handleSearch} className="bg-linkedin-primary hover:bg-linkedin-primary/90"><Search className="w-4 h-4 mr-2" /> Search</Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex gap-4">
              <Skeleton className="w-12 h-12 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No jobs found. Try refining your resume or changing keywords.</div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-linkedin-bg text-linkedin-primary rounded-md flex items-center justify-center font-bold text-xl">
                    {job.company.display_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company.display_name}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location.display_name}</span>
                    </div>
                  </div>
                </div>
                {job.salary_min && (
                  <div className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-gray-600 line-clamp-2">{job.description}</p>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => window.open(job.redirect_url, '_blank')} className="bg-white text-linkedin-primary border border-linkedin-primary hover:bg-linkedin-bg">
                  Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}