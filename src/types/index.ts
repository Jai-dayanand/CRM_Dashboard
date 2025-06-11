export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'counselor' | 'student';
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  preferredDestination: string[];
  status: 'inquiry' | 'consultation' | 'application' | 'offer' | 'visa' | 'enrolled';
  counselorId: string;
  createdAt: string;
  updatedAt: string;
  profile: StudentProfile;
  documents: Document[];
  tasks: Task[];
  feedback?: Feedback;
}

export interface StudentProfile {
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  education: EducationHistory[];
  englishProficiency?: EnglishTest;
  workExperience?: WorkExperience[];
  interestedPrograms: string[];
  budget: string;
}

export interface EducationHistory {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa: string;
}

export interface EnglishTest {
  type: 'IELTS' | 'TOEFL' | 'PTE' | 'Duolingo';
  score: string;
  date: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'passport' | 'transcript' | 'certificate' | 'lor' | 'sop' | 'cv' | 'other';
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt: string;
  url?: string;
  comments?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'application' | 'interview' | 'payment' | 'other';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Stats {
  totalStudents: number;
  activeApplications: number;
  completedApplications: number;
  averageRating: number;
  monthlyGrowth: number;
}