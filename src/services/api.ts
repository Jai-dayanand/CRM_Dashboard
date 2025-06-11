import axios from 'axios';
import { Student, Stats, User } from '../types';
import { mockStudents, mockStats, mockCounselors } from '../data/mockData';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock API functions - replace with actual API calls
export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    // Mock login
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: 'mock-token', user: mockCounselors[0] });
      }, 1000);
    });
  },

  // Students
  getStudents: async (): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStudents);
      }, 500);
    });
  },

  getStudent: async (id: string): Promise<Student> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const student = mockStudents.find(s => s.id === id);
        if (student) {
          resolve(student);
        } else {
          reject(new Error('Student not found'));
        }
      }, 500);
    });
  },

  updateStudent: async (id: string, data: Partial<Student>): Promise<Student> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentIndex = mockStudents.findIndex(s => s.id === id);
        if (studentIndex !== -1) {
          mockStudents[studentIndex] = { ...mockStudents[studentIndex], ...data };
          resolve(mockStudents[studentIndex]);
        }
      }, 500);
    });
  },

  createStudent: async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStudent: Student = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockStudents.push(newStudent);
        resolve(newStudent);
      }, 500);
    });
  },

  // Stats
  getStats: async (): Promise<Stats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStats);
      }, 500);
    });
  },

  // Counselors
  getCounselors: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCounselors);
      }, 500);
    });
  },

  // Documents
  uploadDocument: async (studentId: string, file: File): Promise<{ url: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url: `https://example.com/documents/${file.name}` });
      }, 1000);
    });
  },
};