import { Student, Stats, User } from '../types';

export const mockStats: Stats = {
  totalStudents: 245,
  activeApplications: 78,
  completedApplications: 156,
  averageRating: 4.7,
  monthlyGrowth: 12.5
};

export const mockCounselors: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@studyabroad.com',
    role: 'counselor',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@studyabroad.com',
    role: 'counselor',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1-555-0123',
    country: 'India',
    preferredDestination: ['Canada', 'Australia'],
    status: 'application',
    counselorId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    profile: {
      dateOfBirth: '1999-05-15',
      nationality: 'Indian',
      passportNumber: 'A1234567',
      education: [
        {
          id: '1',
          institution: 'Delhi University',
          degree: 'Bachelor of Engineering',
          field: 'Computer Science',
          graduationYear: '2021',
          gpa: '8.5'
        }
      ],
      englishProficiency: {
        type: 'IELTS',
        score: '7.5',
        date: '2023-12-01'
      },
      workExperience: [
        {
          id: '1',
          company: 'Tech Solutions Inc.',
          position: 'Software Developer',
          startDate: '2021-07-01',
          endDate: '2023-12-31',
          description: 'Full-stack development using React and Node.js'
        }
      ],
      interestedPrograms: ['Master of Computer Science', 'MBA'],
      budget: '$50,000 - $80,000'
    },
    documents: [
      {
        id: '1',
        name: 'Passport Copy',
        type: 'passport',
        status: 'verified',
        uploadedAt: '2024-01-16T09:00:00Z',
        url: '#'
      },
      {
        id: '2',
        name: 'Academic Transcripts',
        type: 'transcript',
        status: 'pending',
        uploadedAt: '2024-01-18T11:00:00Z'
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Complete SOP Review',
        description: 'Review and finalize Statement of Purpose',
        type: 'document',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-01T00:00:00Z',
        assignedTo: '1',
        createdAt: '2024-01-15T10:00:00Z'
      }
    ],
    feedback: {
      id: '1',
      rating: 5,
      comment: 'Excellent guidance throughout the process!',
      createdAt: '2024-01-25T16:00:00Z'
    }
  },
  {
    id: '2',
    name: 'James Rodriguez',
    email: 'james.rodriguez@email.com',
    phone: '+1-555-0124',
    country: 'Mexico',
    preferredDestination: ['USA', 'UK'],
    status: 'consultation',
    counselorId: '2',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    profile: {
      dateOfBirth: '1998-08-22',
      nationality: 'Mexican',
      education: [
        {
          id: '2',
          institution: 'Universidad Nacional',
          degree: 'Bachelor of Business Administration',
          field: 'Marketing',
          graduationYear: '2020',
          gpa: '3.8'
        }
      ],
      interestedPrograms: ['MBA', 'Master of Marketing'],
      budget: '$60,000 - $100,000'
    },
    documents: [
      {
        id: '3',
        name: 'Degree Certificate',
        type: 'certificate',
        status: 'uploaded',
        uploadedAt: '2024-01-21T13:00:00Z'
      }
    ],
    tasks: [
      {
        id: '2',
        title: 'Schedule University Interview',
        description: 'Coordinate interview with preferred universities',
        type: 'interview',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-02-05T00:00:00Z',
        assignedTo: '2',
        createdAt: '2024-01-20T14:00:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543210',
    country: 'India',
    preferredDestination: ['Germany', 'Netherlands'],
    status: 'offer',
    counselorId: '1',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-28T16:45:00Z',
    profile: {
      dateOfBirth: '1997-03-10',
      nationality: 'Indian',
      passportNumber: 'B9876543',
      education: [
        {
          id: '3',
          institution: 'IIT Bombay',
          degree: 'Bachelor of Technology',
          field: 'Mechanical Engineering',
          graduationYear: '2019',
          gpa: '9.2'
        }
      ],
      englishProficiency: {
        type: 'TOEFL',
        score: '110',
        date: '2023-11-15'
      },
      workExperience: [
        {
          id: '2',
          company: 'Automotive Corp',
          position: 'Design Engineer',
          startDate: '2019-08-01',
          endDate: '2023-10-31',
          description: 'Product design and development for automotive components'
        }
      ],
      interestedPrograms: ['Master of Engineering', 'MS in Mechanical Engineering'],
      budget: '$40,000 - $60,000'
    },
    documents: [
      {
        id: '4',
        name: 'Letter of Recommendation',
        type: 'lor',
        status: 'verified',
        uploadedAt: '2024-01-12T10:30:00Z'
      },
      {
        id: '5',
        name: 'Statement of Purpose',
        type: 'sop',
        status: 'verified',
        uploadedAt: '2024-01-14T15:20:00Z'
      }
    ],
    tasks: [
      {
        id: '3',
        title: 'Accept University Offer',
        description: 'Review and accept offer from Technical University of Munich',
        type: 'application',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-02-15T00:00:00Z',
        assignedTo: '1',
        createdAt: '2024-01-28T09:00:00Z'
      }
    ]
  }
];