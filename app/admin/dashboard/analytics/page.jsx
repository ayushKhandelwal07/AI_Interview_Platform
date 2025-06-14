"use client"
import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import MockInterview, { InterviewAnalytics, CandidateSession, UserAnswer } from '@/utils/schema';
import { desc, eq, and } from 'drizzle-orm';
import { 
  BarChart3, 
  Users, 
  Award, 
  TrendingUp, 
  Calendar,
  Star,
  User,
  Mail,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Header from "@/app/dashboard/_components/Header";
import { useUser } from '@clerk/nextjs';

export default function Analytics() {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState([]);
  const [candidateResults, setCandidateResults] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAnalyticsData();
    }
  }, [user, isAdmin]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Get all interviews with analytics
      const interviewsWithAnalytics = await db
        .select({
          mockId: MockInterview.mockId,
          jobPosition: MockInterview.jobPosition,
          jobDesc: MockInterview.jobDesc,
          jobExperience: MockInterview.jobExperience,
          createdAt: MockInterview.createdAt,
          totalInterviews: InterviewAnalytics.totalInterviews,
          completedInterviews: InterviewAnalytics.completedInterviews,
          pendingReviews: InterviewAnalytics.pendingReviews,
          averageRating: InterviewAnalytics.averageRating,
          lastUpdated: InterviewAnalytics.lastUpdated
        })
        .from(MockInterview)
        .leftJoin(InterviewAnalytics, eq(MockInterview.mockId, InterviewAnalytics.mockId))
        .where(
          and(
            eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress),
            eq(MockInterview.createdByRole, 'admin')
          )
        )
        .orderBy(desc(MockInterview.createdAt));

      setAnalytics(interviewsWithAnalytics);

      // Get candidate results for detailed view
      const candidateData = await db
        .select({
          sessionId: CandidateSession.id,
          mockId: CandidateSession.mockId,
          candidateName: CandidateSession.candidateName,
          candidateEmail: CandidateSession.candidateEmail,
          status: CandidateSession.status,
          completedAt: CandidateSession.completedAt,
          createdAt: CandidateSession.createdAt,
          jobPosition: MockInterview.jobPosition
        })
        .from(CandidateSession)
        .leftJoin(MockInterview, eq(CandidateSession.mockId, MockInterview.mockId))
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(CandidateSession.completedAt));

      setCandidateResults(candidateData);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
      setLoading(false);
    }
  };

  const viewCandidateDetails = async (candidateSession) => {
    try {
      // Get detailed answers for this candidate
      const answers = await db
        .select()
        .from(UserAnswer)
        .where(
          and(
            eq(UserAnswer.mockIdRef, candidateSession.mockId),
            eq(UserAnswer.userEmail, candidateSession.candidateEmail)
          )
        );

      // Calculate score
      const totalScore = answers.reduce((sum, answer) => {
        return sum + (parseInt(answer.rating) || 0);
      }, 0);
      const avgScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;

      // Show detailed modal or navigate to detailed view
      alert(`Candidate: ${candidateSession.candidateName}\nScore: ${avgScore}/10\nAnswers: ${answers.length}`);
      
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      toast.error('Failed to fetch candidate details');
    }
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score) || 0;
    if (numScore >= 8) return 'text-green-600 bg-green-100';
    if (numScore >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    const numScore = parseFloat(score) || 0;
    if (numScore >= 8) return 'Excellent';
    if (numScore >= 6) return 'Good';
    if (numScore >= 4) return 'Average';
    return 'Needs Improvement';
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview Analytics</h1>
          <p className="mt-2 text-gray-600">Track performance and analyze candidate results</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.reduce((sum, item) => sum + (parseInt(item.totalInterviews) || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.reduce((sum, item) => sum + (parseInt(item.completedInterviews) || 0), 0)}
                </p>
              </div>
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.length > 0 
                    ? (analytics.reduce((sum, item) => sum + (parseFloat(item.averageRating) || 0), 0) / analytics.filter(item => item.averageRating).length).toFixed(1)
                    : '0.0'
                  }/10
                </p>
              </div>
              <div className="bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
                <Award className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.length}</p>
              </div>
              <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Interview Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Interview Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Candidates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.map((interview) => (
                  <tr key={interview.mockId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {interview.jobPosition}
                        </div>
                        <div className="text-sm text-gray-500">
                          {interview.jobExperience} years experience
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interview.totalInterviews || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interview.completedInterviews || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {interview.averageRating ? (
                        <Badge className={`${getScoreColor(interview.averageRating)}`}>
                          {parseFloat(interview.averageRating).toFixed(1)}/10
                        </Badge>
                      ) : (
                        <span className="text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interview.lastUpdated 
                        ? new Date(interview.lastUpdated).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInterview(interview)}
                        className="mr-2 bg-indigo-700 text-white rounded-xl text-sm hover:text-white font-medium hover:bg-indigo-800 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Candidate Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Candidate Results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidateResults.slice(0, 10).map((candidate) => (
                  <tr key={candidate.sessionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.candidateName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {candidate.candidateEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.jobPosition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        candidate.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {candidate.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.completedAt 
                        ? new Date(candidate.completedAt).toLocaleDateString()
                        : 'In Progress'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewCandidateDetails(candidate)}
                        disabled={candidate.status !== 'completed'}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Results
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 