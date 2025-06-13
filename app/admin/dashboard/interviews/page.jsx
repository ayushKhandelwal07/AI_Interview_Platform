"use client"
import React, { useState } from 'react';
import { useAdmin } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CreateInterviewCard from './_components/CreateInterviewCard';
import InterviewDialog from './_components/InterviewDialog';
import Header from "@/app/dashboard/_components/Header";

export default function AdminInterviews() {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview Management</h1>
          <p className="mt-2 text-gray-600">Create and manage AI-powered interviews for candidates</p>
        </div>

        {/* Interview Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <CreateInterviewCard onClick={() => setOpenDialog(true)} />
          
          Future: Add existing interviews cards here
          You can add more interview cards or components here later
        </div>

        {/* Interview Creation Dialog */}
        <InterviewDialog 
          open={openDialog} 
          onOpenChange={setOpenDialog}
        />
      </div>
    </div>
  );
}