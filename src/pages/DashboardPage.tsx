import React, { useState, useEffect } from 'react';
import { Users, FileText, Target, Star, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';
import { Stats, Student } from '../types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, studentsData] = await Promise.all([
          apiService.getStats(),
          apiService.getStudents(),
        ]);
        
        setStats(statsData);
        setRecentStudents(studentsData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Active Applications',
      value: stats?.activeApplications || 0,
      icon: FileText,
      color: 'yellow',
      change: '+8%',
    },
    {
      title: 'Completed Applications',
      value: stats?.completedApplications || 0,
      icon: Target,
      color: 'green',
      change: '+15%',
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating || 0,
      icon: Star,
      color: 'purple',
      change: '+0.2',
    },
  ];

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your students.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <div className="ml-2 flex items-center text-sm text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-900">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(student.status)}>
                  {student.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Add New Student</p>
                  <p className="text-sm text-blue-600">Register a new student inquiry</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Upload Documents</p>
                  <p className="text-sm text-green-600">Manage student documents</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Track Applications</p>
                  <p className="text-sm text-purple-600">Monitor application progress</p>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;