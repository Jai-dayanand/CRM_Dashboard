import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { apiService } from '../services/api';
import { Student } from '../types';
import Button from '../components/ui/Button';
import StudentTable from '../components/students/StudentTable';
import StudentFilters from '../components/students/StudentFilters';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiService.getStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    // Country filter
    if (countryFilter) {
      filtered = filtered.filter(student => student.country === countryFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter, countryFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCountryFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage and track all your students in one place.</p>
        </div>
        <Button icon={Plus}>
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <StudentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        countryFilter={countryFilter}
        onCountryChange={setCountryFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredStudents.length} of {students.length} students
        </span>
        {(searchTerm || statusFilter || countryFilter) && (
          <span>Filters applied</span>
        )}
      </div>

      {/* Students Table */}
      <StudentTable students={filteredStudents} loading={loading} />
    </div>
  );
};

export default StudentsPage;