import React, { useState, useEffect } from 'react';
import { Upload, Download, Eye, Trash2, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';
import { Student, Document } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const DocumentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiService.getStudents();
        setStudents(data);
        if (data.length > 0) {
          setSelectedStudent(data[0].id);
          setDocuments(data[0].documents);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId);
    const student = students.find(s => s.id === studentId);
    setDocuments(student?.documents || []);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedStudent) return;

    try {
      const result = await apiService.uploadDocument(selectedStudent, selectedFile);
      toast.success('Document uploaded successfully!');
      setUploadModalOpen(false);
      setSelectedFile(null);
      
      // Refresh documents
      const updatedStudents = await apiService.getStudents();
      setStudents(updatedStudents);
      const student = updatedStudents.find(s => s.id === selectedStudent);
      setDocuments(student?.documents || []);
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploaded': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusVariant = (status: Document['status']) => {
    switch (status) {
      case 'verified': return 'success';
      case 'rejected': return 'error';
      case 'uploaded': return 'warning';
      default: return 'default';
    }
  };

  const getDocumentTypeLabel = (type: Document['type']) => {
    const labels = {
      passport: 'Passport',
      transcript: 'Transcript',
      certificate: 'Certificate',
      lor: 'Letter of Recommendation',
      sop: 'Statement of Purpose',
      cv: 'CV/Resume',
      other: 'Other'
    };
    return labels[type] || type;
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage student documents and track verification status.</p>
        </div>
        <Button icon={Upload} onClick={() => setUploadModalOpen(true)}>
          Upload Document
        </Button>
      </div>

      {/* Student Selection */}
      <Card>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Student:</label>
          <select
            value={selectedStudent}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.email}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document) => (
          <Card key={document.id} hover>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {getStatusIcon(document.status)}
                <Badge variant={getStatusVariant(document.status)}>
                  {document.status}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">{document.name}</h3>
                <p className="text-sm text-gray-600">{getDocumentTypeLabel(document.type)}</p>
              </div>

              <div className="text-xs text-gray-500">
                <p>Uploaded: {format(new Date(document.uploadedAt), 'MMM d, yyyy')}</p>
              </div>

              {document.comments && (
                <div className="p-2 bg-yellow-50 rounded-md">
                  <p className="text-xs text-yellow-800">{document.comments}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" icon={Eye} className="flex-1">
                  View
                </Button>
                <Button variant="outline" size="sm" icon={Download}>
                  Download
                </Button>
                <Button variant="outline" size="sm" icon={Trash2} className="text-red-600 hover:text-red-700">
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {documents.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">
              {selectedStudent ? 'This student has no documents uploaded yet.' : 'Select a student to view their documents.'}
            </p>
            {selectedStudent && (
              <Button icon={Upload} onClick={() => setUploadModalOpen(true)}>
                Upload First Document
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Document"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="passport">Passport</option>
              <option value="transcript">Transcript</option>
              <option value="certificate">Certificate</option>
              <option value="lor">Letter of Recommendation</option>
              <option value="sop">Statement of Purpose</option>
              <option value="cv">CV/Resume</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File
            </label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setUploadModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFileUpload}
              disabled={!selectedFile || !selectedStudent}
              className="flex-1"
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentsPage;