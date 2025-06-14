import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import MockInterview, { InterviewLink, InterviewAnalytics, CandidateSession, UserAnswer } from '@/utils/schema';
import { desc, eq, and } from 'drizzle-orm';
import { toast } from 'sonner';

export function useAdminInterviews() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterviews = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch interviews with their corresponding links
      const interviewData = await db
        .select({
          mockId: MockInterview.mockId,
          jobPosition: MockInterview.jobPosition,
          jobDesc: MockInterview.jobDesc,
          jobExperience: MockInterview.jobExperience,
          createdBy: MockInterview.createdBy,
          createdAt: MockInterview.createdAt,
          createdByRole: MockInterview.createdByRole,
          // Interview link data
          link: InterviewLink.link,
          linkStatus: InterviewLink.status,
          candidateEmail: InterviewLink.candidateEmail,
          linkCreatedAt: InterviewLink.createdAt,
        })
        .from(MockInterview)
        .leftJoin(InterviewLink, eq(MockInterview.mockId, InterviewLink.mockId))
        .where(
          and(
            eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress),
            eq(MockInterview.createdByRole, 'admin')
          )
        )
        .orderBy(desc(MockInterview.createdAt));

      setInterviews(interviewData);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError(error.message);
      toast.error('Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const refreshInterviews = () => {
    fetchInterviews();
  };

  const deleteInterview = async (mockId) => {
    try {
      // Delete all related records first (in order to avoid foreign key constraint violations)
      
      // 1. Delete UserAnswer records (uses mockIdRef)
      await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));
      
      // 2. Delete CandidateSession records
      await db.delete(CandidateSession).where(eq(CandidateSession.mockId, mockId));
      
      // 3. Delete InterviewAnalytics records
      await db.delete(InterviewAnalytics).where(eq(InterviewAnalytics.mockId, mockId));
      
      // 4. Delete InterviewLink records
      await db.delete(InterviewLink).where(eq(InterviewLink.mockId, mockId));
      
      // 5. Finally delete the main MockInterview record
      await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));
      
      toast.success('Interview deleted successfully');
      refreshInterviews(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview: ' + error.message);
      return false;
    }
  };

  const updateLinkStatus = async (mockId, newStatus) => {
    try {
      await db
        .update(InterviewLink)
        .set({ status: newStatus })
        .where(eq(InterviewLink.mockId, mockId));
      
      toast.success(`Interview status updated to ${newStatus}`);
      refreshInterviews(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  return {
    interviews,
    loading,
    error,
    refreshInterviews,
    deleteInterview,
    updateLinkStatus,
    // Computed values
    totalInterviews: interviews.length,
    activeInterviews: interviews.filter(i => i.linkStatus === 'active').length,
    inactiveInterviews: interviews.filter(i => i.linkStatus === 'inactive').length,
  };
} 