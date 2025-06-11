import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';
import { Student } from '../types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const FeedbackPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiService.getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const studentsWithFeedback = students.filter(student => student.feedback);
  const averageRating = studentsWithFeedback.reduce((sum, student) => sum + (student.feedback?.rating || 0), 0) / studentsWithFeedback.length || 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: studentsWithFeedback.filter(student => student.feedback?.rating === rating).length
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-600">Monitor student satisfaction and service quality.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">{averageRating.toFixed(1)}</p>
                <div className="ml-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">{studentsWithFeedback.length}</p>
                <div className="ml-2 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round((studentsWithFeedback.length / students.length) * 100)}%
                </p>
                <div className="ml-2 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5%
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count }) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${studentsWithFeedback.length > 0 ? (count / studentsWithFeedback.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {studentsWithFeedback.slice(0, 3).map((student) => (
              <div key={student.id} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{student.name}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (student.feedback?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{student.feedback?.comment}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(student.feedback?.createdAt || ''), 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* All Feedback */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Feedback</h3>
        <div className="space-y-6">
          {studentsWithFeedback.map((student) => (
            <div key={student.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-900">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={
                    student.status === 'enrolled' ? 'success' :
                    student.status === 'offer' ? 'info' :
                    student.status === 'application' ? 'warning' : 'default'
                  }>
                    {student.status}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {format(new Date(student.feedback?.createdAt || ''), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < (student.feedback?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {student.feedback?.rating}/5 stars
                </span>
              </div>
              
              <p className="text-gray-700">{student.feedback?.comment}</p>
            </div>
          ))}
        </div>

        {studentsWithFeedback.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-600">
              Student feedback will appear here once they submit their reviews.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FeedbackPage;