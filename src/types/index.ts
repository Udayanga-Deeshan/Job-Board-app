export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  type: 'remote' | 'onsite' | 'hybrid';
  postedAt: string;
  experience: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
}