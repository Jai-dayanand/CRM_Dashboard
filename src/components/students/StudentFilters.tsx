import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface StudentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  countryFilter: string;
  onCountryChange: (value: string) => void;
  onClearFilters: () => void;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  countryFilter,
  onCountryChange,
  onClearFilters,
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'inquiry', label: 'Inquiry' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'application', label: 'Application' },
    { value: 'offer', label: 'Offer' },
    { value: 'visa', label: 'Visa' },
    { value: 'enrolled', label: 'Enrolled' },
  ];

  const countryOptions = [
    { value: '', label: 'All Countries' },
    { value: 'India', label: 'India' },
    { value: 'China', label: 'China' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Brazil', label: 'Brazil' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={onStatusChange}
            options={statusOptions}
            className="w-40"
          />
          <Select
            placeholder="Country"
            value={countryFilter}
            onChange={onCountryChange}
            options={countryOptions}
            className="w-40"
          />
          <Button
            variant="outline"
            icon={Filter}
            onClick={onClearFilters}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentFilters;