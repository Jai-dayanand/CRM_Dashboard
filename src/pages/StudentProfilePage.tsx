import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Edit,
  Star,
  Target,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';
import { Student } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      
      try {
        const data = await apiService.getStudent(id);
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Student not found</h2>
        <Button onClick={() => navigate('/students')} className="mt-4">
          Back to Students
        </Button>
      </div>
    );
  }

  const getStatusVariant = (status: Student['status']) => {
    switch (status) {
      case 'inquiry': return 'default';
      case 'consultation': return 'info';
      case 'application': return 'warning';
      case 'offer': return 'success';
      case 'visa': return 'info';
      case 'enrolled': return 'success';
      default: return 'default';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'documents', label: 'Documents' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/students')}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-600">Student Profile</p>
          </div>
        </div>
        <Button icon={Edit} onClick={() => navigate(`/students/${student.id}/edit`)}>
          Edit Profile
        </Button>
      </div>

      {/* Student Header Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-900">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
                <Badge variant={getStatusVariant(student.status)}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{student.country}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium">{format(new Date(student.createdAt), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Preferred Destinations:</span>
                <span className="font-medium">{student.preferredDestination.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Budget:</span>
                <span className="font-medium">{student.profile.budget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Programs:</span>
                <span className="font-medium">{student.profile.interestedPrograms.join(', ')}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {student.tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  {getTaskStatusIcon(task.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">Due: {format(new Date(task.dueDate), 'MMM d')}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">{format(new Date(student.profile.dateOfBirth), 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <p className="mt-1 text-sm text-gray-900">{student.profile.nationality}</p>
              </div>
              {student.profile.passportNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                  <p className="mt-1 text-sm text-gray-900">{student.profile.passportNumber}</p>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            <div className="space-y-4">
              {student.profile.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h4>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">Graduated: {edu.graduationYear} | GPA: {edu.gpa}</p>
                </div>
              ))}
            </div>
          </Card>

          {student.profile.englishProficiency && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">English Proficiency</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Test:</span>
                  <span className="font-medium">{student.profile.englishProficiency.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-medium">{student.profile.englishProficiency.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{format(new Date(student.profile.englishProficiency.date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </Card>
          )}

          {student.profile.workExperience && student.profile.workExperience.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
              <div className="space-y-4">
                {student.profile.workExperience.map((work) => (
                  <div key={work.id} className="border-l-4 border-green-200 pl-4">
                    <h4 className="font-medium text-gray-900">{work.position}</h4>
                    <p className="text-sm text-gray-600">{work.company}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(work.startDate), 'MMM yyyy')} - 
                      {work.endDate ? format(new Date(work.endDate), 'MMM yyyy') : 'Present'}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{work.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {student.documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <Badge variant={
                    doc.status === 'verified' ? 'success' :
                    doc.status === 'rejected' ? 'error' :
                    doc.status === 'uploaded' ? 'warning' : 'default'
                  }>
                    {doc.status}
                  </Badge>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
                <p className="text-sm text-gray-500 capitalize">{doc.type}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Uploaded: {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'tasks' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h3>
          <div className="space-y-4">
            {student.tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getTaskStatusIcon(task.status)}
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      task.priority === 'high' ? 'error' :
                      task.priority === 'medium' ? 'warning' : 'default'
                    }>
                      {task.priority}
                    </Badge>
                    <Badge variant={
                      task.status === 'completed' ? 'success' :
                      task.status === 'in-progress' ? 'warning' :
                      task.status === 'overdue' ? 'error' : 'default'
                    }>
                      {task.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                  <span>Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'feedback' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h3>
          {student.feedback ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < student.feedback!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {student.feedback.rating}/5 stars
                </span>
              </div>
              <p className="text-gray-700">{student.feedback.comment}</p>
              <p className="text-sm text-gray-500">
                Submitted on {format(new Date(student.feedback.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No feedback provided yet.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default StudentProfilePage;