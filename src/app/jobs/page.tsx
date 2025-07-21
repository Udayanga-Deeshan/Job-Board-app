'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchJobsStart, fetchJobsSuccess, fetchJobsFailure } from '../../store/jobsSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Briefcase, MapPin, DollarSign, Clock, Bookmark, Search } from 'lucide-react';
import { toast } from 'sonner';
import { jobApplicationSchema } from '../lib/validations/schemas';

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

const JobListings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    salaryRange: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(fetchJobsStart());
      try {
       
        const response = await fetch('https://687dc9ec918b64224332bcf4.mockapi.io/api/jobs');
        const data = await response.json();
        dispatch(fetchJobsSuccess(data));
      } catch (err) {
        dispatch(fetchJobsFailure(err instanceof Error ? err.message : 'Failed to fetch jobs'));
        toast.error('Failed to fetch jobs');
      }
    };

    fetchJobs();
  }, [dispatch]);

  const applicationForm = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
  });

  const handleApply = async (data: JobApplicationFormData) => {
    try {
      
      await fetch('https://65f25a57034bdbecc764a6b9.mockapi.io/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: selectedJob?.id,
          candidateId: user?.id,
          ...data,
          status: 'pending',
          appliedAt: new Date().toISOString()
        }),
      });
      toast.success('Application submitted successfully!');
      setSelectedJob(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.jobType || job.type === filters.jobType;
    const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSalary = !filters.salaryRange || 
                         (job.salary && 
                          parseInt(job.salary.replace(/[^0-9]/g, '')) >= parseInt(filters.salaryRange));

    return matchesSearch && matchesType && matchesLocation && matchesSalary;
  });

  const handleSaveJob = async (jobId: string) => {
    try {
      await fetch('https://65f25a57034bdbecc764a6b9.mockapi.io/api/saved-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          userId: user?.id,
          savedAt: new Date().toISOString()
        }),
      });
      toast.success('Job saved successfully!');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  if (!user || user.role !== 'candidate') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-semibold">Access Restricted</h2>
            <p className="text-gray-500 dark:text-gray-400">This page is only available to candidates</p>
          </div>
          <button 
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Dream Job</h1>
        
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs, companies, or keywords"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                value={filters.jobType}
                onChange={(e) => setFilters({...filters, jobType: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                placeholder="Any location"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Min Salary ($)</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                value={filters.salaryRange}
                onChange={(e) => setFilters({...filters, salaryRange: e.target.value})}
              >
                <option value="">Any Salary</option>
                <option value="50000">$50,000+</option>
                <option value="75000">$75,000+</option>
                <option value="100000">$100,000+</option>
                <option value="125000">$125,000+</option>
                <option value="150000">$150,000+</option>
              </select>
            </div>
          </div>
        </div>
        
        
        <div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="space-y-2 mb-4">
                <h2 className="text-xl font-semibold">Error loading jobs</h2>
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
              </div>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No jobs found matching your criteria</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
                      </div>
                      <button 
                        onClick={() => handleSaveJob(job.id)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        aria-label="Save job"
                      >
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        <MapPin className="mr-1 h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <DollarSign className="mr-1 h-3 w-3" />
                        {job.salary || 'Salary not disclosed'}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                        <Clock className="mr-1 h-3 w-3" />
                        {job.type}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{job.description}</p>
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center">
                     
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDialogOpen(true);
                        }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Dialog */}
      {isDialogOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Apply for {selectedJob.title}</h2>
                <button 
                  onClick={() => setIsDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium">{selectedJob.company}</h3>
                <div className="flex gap-2 mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPin className="mr-1 h-3 w-3" /> {selectedJob.location}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <DollarSign className="mr-1 h-3 w-3" /> {selectedJob.salary || 'Salary not disclosed'}
                  </span>
                </div>
              </div>
              
              <form onSubmit={applicationForm.handleSubmit(handleApply)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    id="name"
                    {...applicationForm.register('name')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    placeholder="Your full name"
                    defaultValue={user.name}
                  />
                  {applicationForm.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {applicationForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...applicationForm.register('email')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    placeholder="your.email@example.com"
                    defaultValue={user.email}
                  />
                  {applicationForm.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {applicationForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium mb-1">Resume (URL or text)</label>
                  <textarea
                    id="resume"
                    {...applicationForm.register('resume')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    placeholder="Paste your resume or a link to it"
                    rows={4}
                  />
                  {applicationForm.formState.errors.resume && (
                    <p className="text-sm text-red-500 mt-1">
                      {applicationForm.formState.errors.resume.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">Cover Letter (Optional)</label>
                  <textarea
                    id="coverLetter"
                    {...applicationForm.register('coverLetter')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    placeholder="Why are you a good fit for this role?"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;