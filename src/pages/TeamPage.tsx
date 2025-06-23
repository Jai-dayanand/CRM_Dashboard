import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, MapPin, Calendar, Edit, Trash2, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

interface TeamMember {
  name: string;
  number: string;
  mail: string;
  position: string;
  department?: string;
  location?: string;
  joinDate?: string;
  status?: string;
  skills?: string;
  experience?: string;
  sheet?: string;
}

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sheetFilter, setSheetFilter] = useState('');
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  
  // New member form state
  const [newMember, setNewMember] = useState({
    name: '',
    number: '',
    mail: '',
    position: '',
    department: '',
    location: '',
    status: 'Active',
    skills: '',
    experience: ''
  });

  // Google Sheets configuration
  const SPREADSHEET_ID = '1a9u9iMaBkKdR6BdypROgqtClpUnwuNHSbk7qXMMDVCw';
  const API_KEY = 'AIzaSyC_zg3PbQOGrTqm2ipWLhzeYxf_yL5szWw'; // You'll need to set this

  useEffect(() => {
    fetchTeamData();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [teamMembers, searchTerm, positionFilter, departmentFilter, sheetFilter]);

  const fetchTeamData = async () => {
    try {
      // First, get the list of sheets
      const sheetsResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`
      );
      
      if (!sheetsResponse.ok) {
        // Fallback to mock data if API is not configured
        console.warn('Google Sheets API not configured, using mock data');
        loadMockData();
        return;
      }

      const sheetsData = await sheetsResponse.json();
      const sheets = sheetsData.sheets.map((sheet: any) => sheet.properties.title);
      setAvailableSheets(sheets);

      // Fetch data from all sheets
      const allMembers: TeamMember[] = [];
      
      for (const sheetName of sheets) {
        try {
          const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!A:Z?key=${API_KEY}`
          );
          
          if (response.ok) {
            const data = await response.json();
            const rows = data.values || [];
            
            if (rows.length > 1) {
              const headers = rows[0].map((h: string) => h.toLowerCase());
              const members = rows.slice(1).map((row: string[]) => {
                const member: any = { sheet: sheetName };
                headers.forEach((header: string, index: number) => {
                  member[header] = row[index] || '';
                });
                return member;
              });
              allMembers.push(...members);
            }
          }
        } catch (error) {
          console.error(`Error fetching data from sheet ${sheetName}:`, error);
        }
      }

      setTeamMembers(allMembers);
    } catch (error) {
      console.error('Error fetching team data:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockMembers: TeamMember[] = [
      {
        name: 'Sarah Johnson',
        number: '+1-555-0123',
        mail: 'sarah.johnson@company.com',
        position: 'Senior Counselor',
        department: 'Student Services',
        location: 'New York',
        joinDate: '2022-01-15',
        status: 'Active',
        skills: 'Student Counseling, Application Review',
        experience: '5 years',
        sheet: 'Staff'
      },
      {
        name: 'Michael Chen',
        number: '+1-555-0124',
        mail: 'michael.chen@company.com',
        position: 'Application Specialist',
        department: 'Admissions',
        location: 'California',
        joinDate: '2023-03-20',
        status: 'Active',
        skills: 'Document Review, University Relations',
        experience: '3 years',
        sheet: 'Staff'
      },
      {
        name: 'Emily Rodriguez',
        number: '+1-555-0125',
        mail: 'emily.rodriguez@company.com',
        position: 'Marketing Manager',
        department: 'Marketing',
        location: 'Texas',
        joinDate: '2021-11-10',
        status: 'Active',
        skills: 'Digital Marketing, Content Creation',
        experience: '7 years',
        sheet: 'Marketing'
      }
    ];
    setTeamMembers(mockMembers);
    setAvailableSheets(['Staff', 'Marketing', 'Interns']);
  };

  const filterMembers = () => {
    let filtered = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (positionFilter) {
      filtered = filtered.filter(member => 
        member.position.toLowerCase().includes(positionFilter.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(member => 
        member.department?.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }

    if (sheetFilter) {
      filtered = filtered.filter(member => member.sheet === sheetFilter);
    }

    setFilteredMembers(filtered);
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.mail || !newMember.position || !selectedSheet) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // In a real implementation, you would append to the Google Sheet here
      const memberToAdd = { ...newMember, sheet: selectedSheet };
      setTeamMembers(prev => [...prev, memberToAdd]);
      
      // Reset form
      setNewMember({
        name: '',
        number: '',
        mail: '',
        position: '',
        department: '',
        location: '',
        status: 'Active',
        skills: '',
        experience: ''
      });
      setSelectedSheet('');
      setAddMemberModalOpen(false);
      
      toast.success('Team member added successfully!');
    } catch (error) {
      toast.error('Failed to add team member');
    }
  };

  const getUniqueValues = (field: keyof TeamMember) => {
    return [...new Set(teamMembers.map(member => member[field]).filter(Boolean))];
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Department', 'Location', 'Status', 'Sheet'];
    const csvContent = [
      headers.join(','),
      ...filteredMembers.map(member => [
        member.name,
        member.mail,
        member.number,
        member.position,
        member.department || '',
        member.location || '',
        member.status || '',
        member.sheet || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team-members.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Team Management</h1>
            <p className="text-gray-400 mt-2">
              Manage your team members across different departments and sheets
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon={Download}
              onClick={exportToCSV}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Export CSV
            </Button>
            <Button
              icon={Plus}
              onClick={() => setAddMemberModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Member
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-900/50">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Members</p>
                <p className="text-2xl font-semibold text-white">{teamMembers.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-900/50">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active</p>
                <p className="text-2xl font-semibold text-white">
                  {teamMembers.filter(m => m.status === 'Active').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-900/50">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Departments</p>
                <p className="text-2xl font-semibold text-white">
                  {getUniqueValues('department').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-900/50">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Sheets</p>
                <p className="text-2xl font-semibold text-white">{availableSheets.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Positions</option>
              {getUniqueValues('position').map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {getUniqueValues('department').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={sheetFilter}
              onChange={(e) => setSheetFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sheets</option>
              {availableSheets.map(sheet => (
                <option key={sheet} value={sheet}>{sheet}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredMembers.length} of {teamMembers.length} members
          </span>
          {(searchTerm || positionFilter || departmentFilter || sheetFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setPositionFilter('');
                setDepartmentFilter('');
                setSheetFilter('');
              }}
              className="text-gray-400 hover:text-white"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Badge variant={member.status === 'Active' ? 'success' : 'default'}>
                      {member.status || 'Active'}
                    </Badge>
                    <Badge variant="info">
                      {member.sheet}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-blue-400 font-medium">{member.position}</p>
                  {member.department && (
                    <p className="text-gray-400 text-sm">{member.department}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{member.mail}</span>
                  </div>
                  {member.number && (
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{member.number}</span>
                    </div>
                  )}
                  {member.location && (
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{member.location}</span>
                    </div>
                  )}
                  {member.joinDate && (
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {member.skills && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Skills:</p>
                    <p className="text-sm text-gray-300">{member.skills}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button variant="ghost" size="sm" icon={Edit} className="flex-1 text-gray-400 hover:text-white">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" icon={Trash2} className="text-gray-400 hover:text-red-400">
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {teamMembers.length === 0 ? 'No team members found' : 'No members match your search'}
              </h3>
              <p className="text-gray-500 mb-4">
                {teamMembers.length === 0 
                  ? 'Add your first team member to get started' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {teamMembers.length === 0 && (
                <Button icon={Plus} onClick={() => setAddMemberModalOpen(true)}>
                  Add First Member
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Add Member Modal */}
        <Modal
          isOpen={addMemberModalOpen}
          onClose={() => setAddMemberModalOpen(false)}
          title="Add Team Member"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name *"
                value={newMember.name}
                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
              <Input
                label="Email *"
                type="email"
                value={newMember.mail}
                onChange={(e) => setNewMember(prev => ({ ...prev, mail: e.target.value }))}
                placeholder="Enter email address"
                required
              />
              <Input
                label="Phone Number"
                value={newMember.number}
                onChange={(e) => setNewMember(prev => ({ ...prev, number: e.target.value }))}
                placeholder="Enter phone number"
              />
              <Input
                label="Position *"
                value={newMember.position}
                onChange={(e) => setNewMember(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Enter job position"
                required
              />
              <Input
                label="Department"
                value={newMember.department}
                onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Enter department"
              />
              <Input
                label="Location"
                value={newMember.location}
                onChange={(e) => setNewMember(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Sheet *"
                value={selectedSheet}
                onChange={setSelectedSheet}
                options={availableSheets.map(sheet => ({ value: sheet, label: sheet }))}
                placeholder="Select sheet"
                required
              />
              <Select
                label="Status"
                value={newMember.status}
                onChange={(value) => setNewMember(prev => ({ ...prev, status: value }))}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'On Leave', label: 'On Leave' }
                ]}
              />
            </div>

            <Input
              label="Skills"
              value={newMember.skills}
              onChange={(e) => setNewMember(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="Enter skills (comma separated)"
            />

            <Input
              label="Experience"
              value={newMember.experience}
              onChange={(e) => setNewMember(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Enter years of experience"
            />

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setAddMemberModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMember}
                className="flex-1"
              >
                Add Member
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TeamPage;