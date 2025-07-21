'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchJobsStart, fetchJobsSuccess, fetchJobsFailure, addJob } from '../../store/jobsSlice';
import { logout, loadUserFromStorage } from '../../store/userSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  PlusCircle, 
  Briefcase, 
  UserCog, 
  FileText,
  DollarSign,
  MapPin,
  Building,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { jobPostingSchema, jobApplicationSchema } from '../lib/validations/schemas';

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
type JobPostingFormData = z.infer<typeof jobPostingSchema>;

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'add-recruiter' | 'post-job'>('jobs');
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    
    dispatch(loadUserFromStorage());
    
    const fetchJobs = async () => {
      dispatch(fetchJobsStart());
      try {
        const response = await fetch(`https://mockapi.io/jobs?page=${page}&limit=10`);
        const data = await response.json();
        dispatch(fetchJobsSuccess(data));
      } catch (err) {
        dispatch(fetchJobsFailure(err instanceof Error ? err.message : 'Failed to fetch jobs'));
        toast.error('Failed to fetch jobs');
      }
    };

    fetchJobs();
  }, [dispatch, page]);

  const applicationForm = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
  });

  const jobPostingForm = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
  });

  const handleApply = async (data: JobApplicationFormData) => {
    try {
      await fetch('https://687dc9ec918b64224332bcf4.mockapi.io/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: selectedJob?.id,
          candidateId: user?.id,
          ...data,
        }),
      });
      toast.success('Your application has been received.');
      setSelectedJob(null);
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const handlePostJob = async (data: JobPostingFormData) => {
    try {
      const response = await fetch('https://687dc9ec918b64224332bcf4.mockapi.io/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          postedBy: user?.id,
          createdAt: new Date().toISOString(),
        }),
      });
      const newJob = await response.json();
      dispatch(addJob(newJob));
      toast.success('Your job listing has been published.');
      jobPostingForm.reset();
      setActiveTab('jobs');
    } catch (error) {
      toast.error('Failed to post job');
    }
  };

  const loadMoreJobs = () => {
    setPage(prev => prev + 1);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-semibold">Access Denied</h2>
            <p className="text-gray-500 dark:text-gray-400">Please log in to view the dashboard</p>
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
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-64 bg-gray-100 dark:bg-gray-800 p-4 flex-col border-r">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Job Board</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user?.name}</p>
          <button 
            onClick={handleLogout}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Logout
          </button>
        </div>
        
        <nav className="space-y-2">
          <button
            className={`w-full flex items-center px-3 py-2 rounded-md text-left ${activeTab === 'jobs' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Job Listings
          </button>
          
          {user?.role === 'admin' && (
            <button
              className={`w-full flex items-center px-3 py-2 rounded-md text-left ${activeTab === 'add-recruiter' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab('add-recruiter')}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Add Recruiter
            </button>
          )}
          
          {(user?.role === 'admin' || user?.role === 'recruiter') && (
            <button
              className={`w-full flex items-center px-3 py-2 rounded-md text-left ${activeTab === 'post-job' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab('post-job')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Job
            </button>
          )}
        </nav>
      </div>

      <div className="flex-1 p-6">
        <div className="md:hidden flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600'}`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
          {user?.role === 'admin' && (
            <button
              className={`px-3 py-1 rounded-md text-sm ${activeTab === 'add-recruiter' ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600'}`}
              onClick={() => setActiveTab('add-recruiter')}
            >
              Add Recruiter
            </button>
          )}
          {(user?.role === 'admin' || user?.role === 'recruiter') && (
            <button
              className={`px-3 py-1 rounded-md text-sm ${activeTab === 'post-job' ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600'}`}
              onClick={() => setActiveTab('post-job')}
            >
              Post Job
            </button>
          )}
        </div>

        {activeTab === 'jobs' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>
            
            {loading && page === 1 ? (
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
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm mt-1">
                        <span>{job.company} • {job.location}</span>
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="line-clamp-2 text-gray-700 dark:text-gray-300">{job.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{job.type}</span>
                      {user?.role === 'candidate' && (
                        <button 
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            setSelectedJob(job);
                            setIsDialogOpen(true);
                          }}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {jobs.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      onClick={loadMoreJobs} 
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More Jobs'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add-recruiter' && user?.role === 'admin' && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Recruiter</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  placeholder="Recruiter's full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  placeholder="recruiter@example.com"
                />
              </div>
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Recruiter
              </button>
            </form>
          </div>
        )}

        {activeTab === 'post-job' && (user?.role === 'admin' || user?.role === 'recruiter') && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <form onSubmit={jobPostingForm.handleSubmit(handlePostJob)} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Job Title</label>
                  <input
                    id="title"
                    {...jobPostingForm.register('title')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    placeholder="Software Engineer"
                  />
                  {jobPostingForm.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {jobPostingForm.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="company"
                      {...jobPostingForm.register('company')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      placeholder="Acme Inc."
                    />
                  </div>
                  {jobPostingForm.formState.errors.company && (
                    <p className="text-sm text-red-500 mt-1">
                      {jobPostingForm.formState.errors.company.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="location"
                      {...jobPostingForm.register('location')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      placeholder="New York, NY or Remote"
                    />
                  </div>
                  {jobPostingForm.formState.errors.location && (
                    <p className="text-sm text-red-500 mt-1">
                      {jobPostingForm.formState.errors.location.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium mb-1">Salary Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="salary"
                      {...jobPostingForm.register('salary')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      placeholder="$80,000 - $120,000"
                    />
                  </div>
                  {jobPostingForm.formState.errors.salary && (
                    <p className="text-sm text-red-500 mt-1">
                      {jobPostingForm.formState.errors.salary.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">Job Type</label>
                  <select
                    id="type"
                    {...jobPostingForm.register('type')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                  {jobPostingForm.formState.errors.type && (
                    <p className="text-sm text-red-500 mt-1">
                      {jobPostingForm.formState.errors.type.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Job Description</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      id="description"
                      {...jobPostingForm.register('description')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      placeholder="Detailed job description..."
                      rows={6}
                    />
                  </div>
                  {jobPostingForm.formState.errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {jobPostingForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post Job
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

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
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={applicationForm.handleSubmit(handleApply)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    id="name"
                    {...applicationForm.register('name')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    placeholder="Your full name"
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
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;