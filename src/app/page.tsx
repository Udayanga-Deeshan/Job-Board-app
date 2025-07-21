import { Briefcase, ArrowRight, Users, FileText, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Job or Top Talent</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connecting skilled professionals with innovative companies worldwide
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              href="/register/" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors flex items-center"
            >
              Sign Up as Candidate
              <ArrowRight className="ml-2" size={18} />
            </Link>
            
          </div>
        </div>
      </div>

      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Briefcase className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="text-2xl font-bold mb-2 dark:text-white">10,000+</h3>
            <p className="text-gray-600 dark:text-gray-300">Active Job Listings</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Users className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="text-2xl font-bold mb-2 dark:text-white">5,000+</h3>
            <p className="text-gray-600 dark:text-gray-300">Companies Hiring</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <FileText className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="text-2xl font-bold mb-2 dark:text-white">50,000+</h3>
            <p className="text-gray-600 dark:text-gray-300">Successful Hires</p>
          </div>
        </div>
      </div>

      
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Create Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up as a candidate or employer and complete your profile to get started.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-300 font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Find Opportunities</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse jobs or candidates that match your skills and preferences.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-300 font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Connect & Grow</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Apply for jobs or contact candidates directly through our platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take the next step in your career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs through our platform
          </p>
         
        </div>
      </div>
    </div>
  );
}