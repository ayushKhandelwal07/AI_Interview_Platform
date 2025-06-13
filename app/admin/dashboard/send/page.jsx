"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAdmin } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import MockInterview, { InterviewLink, CandidateSession } from '@/utils/schema';
import { desc, eq, and } from 'drizzle-orm';
import { v4 as uuid4 } from 'uuid';
import { 
  Send, 
  Mail, 
  User, 
  Copy, 
  CheckCircle, 
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Header from "@/app/dashboard/_components/Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SendInterview() {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchInterviews();
    }
  }, [user, isAdmin]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const result = await db
        .select({
          mockId: MockInterview.mockId,
          jobPosition: MockInterview.jobPosition,
          jobDesc: MockInterview.jobDesc,
          jobExperience: MockInterview.jobExperience,
          createdAt: MockInterview.createdAt,
        })
        .from(MockInterview)
        .where(
          and(
            eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress),
            eq(MockInterview.createdByRole, 'admin')
          )
        )
        .orderBy(desc(MockInterview.createdAt));

      setInterviews(result);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const generateCandidateLink = async (mockId, email, name) => {
    try {
      setSendingEmail(true);
      
      // Generate unique token
      const uniqueToken = uuid4();
      
      // Create candidate session
      await db.insert(CandidateSession).values({
        mockId: mockId,
        candidateEmail: email,
        candidateName: name,
        uniqueToken: uniqueToken,
        status: 'pending'
      });

      // Generate candidate interview URL
      const candidateUrl = `${window.location.origin}/exam/dashboard/interview/${uniqueToken}`;
      
      // Send email to candidate
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateEmail: email,
          candidateName: name,
          jobPosition: selectedInterview.jobPosition,
          jobDesc: selectedInterview.jobDesc,
          jobExperience: selectedInterview.jobExperience,
          interviewLink: candidateUrl,
        }),
      });

      const emailResult = await emailResponse.json();

      if (emailResponse.ok) {
        // Also copy to clipboard for backup
        try {
          await navigator.clipboard.writeText(candidateUrl);
          toast.success('Interview invitation sent successfully via email! Link also copied to clipboard.');
        } catch (clipboardError) {
          toast.success('Interview invitation sent successfully via email!');
        }
        console.log('Email sent:', emailResult.messageId);
      } else {
        // If email fails, still try to copy to clipboard
        try {
          await navigator.clipboard.writeText(candidateUrl);
          toast.error(`Email failed: ${emailResult.error}. Link copied to clipboard instead.`);
        } catch (clipboardError) {
          toast.error(`Email failed: ${emailResult.error}. Please copy the link manually.`);
        }
        console.error('Email error:', emailResult.details);
      }
      
      // Reset form
      setCandidateEmail('');
      setCandidateName('');
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Error generating link:', error);
      toast.error('Failed to generate interview link');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendInterview = (interview) => {
    setSelectedInterview(interview);
    setOpenDialog(true);
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.jobDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Send Interview Links</h1>
          <p className="mt-2 text-gray-600">Share interview links with candidates via email</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search interviews by position or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Interviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((interview) => (
            <div
              key={interview.mockId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {interview.jobPosition}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {interview.jobExperience} years experience
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {interview.jobDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Created: {new Date(interview.createdAt).toLocaleDateString()}</span>
              </div>

              <Button
                onClick={() => handleSendInterview(interview)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Candidate
              </Button>
            </div>
          ))}
        </div>

        {filteredInterviews.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create some interviews first to send to candidates'}
            </p>
          </div>
        )}

        {/* Send Interview Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Send Interview Link</DialogTitle>
              <DialogDescription>
                Enter candidate details to generate and send interview link for:
                <strong className="block mt-1 text-xl">{selectedInterview?.jobPosition}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name
                </label>
                <Input
                  className="rounded-xl"
                  placeholder="Enter candidate name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Email
                </label>
                <Input
                  className="rounded-xl"
                  type="email"
                  placeholder="Enter candidate email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                />
              </div>

              {/* Email Feature Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <div className="flex items-start">
                  <Mail className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">Email + Clipboard</p>
                    <p className="text-blue-700">Interview invitation will be sent via email and link copied to clipboard as backup.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => generateCandidateLink(selectedInterview?.mockId, candidateEmail, candidateName)}
                  disabled={!candidateEmail || !candidateName || sendingEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email Invitation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 