import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Trash2 } from 'lucide-react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import MockInterview from '@/utils/schema';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function InterviewItemCard({interview}) {
const router = useRouter();

const onStart = () => {
      router.push('/dashboard/interview/'+interview?.mockId)
}

const onFeedback = () => {
      router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
}

const deleteInterview = async () => {
  try {
    await db.delete(MockInterview)
      .where(eq(MockInterview.mockId, interview.mockId));
    
    // Show success toast
    router.push("/dashboard");
    toast.success('Interview deleted successfully', {
      description: 'The interview has been permanently removed',
      duration: 3000, // Show for 3 seconds
    });

    // Refresh the page after a short delay to allow the toast to be visible
    setTimeout(() => {
      router.refresh();
    }, 500);

  } catch (error) {
    // Show error toast
    toast.error('Failed to delete interview', {
      description: 'There was an error deleting the interview. Please try again.',
      duration: 3000,
    });
    console.error("Error deleting interview:", error);
  }
}


  return (
<div class="border border-slate-500 bg-white-100 rounded-xl p-4 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:indigo-blue-100 hover:shadow-lg hover:shadow-indigo-200/50 cursor-pointer">
    <div className="flex justify-between items-start mb-1">
      <h2 className="font-medium text-lg text-blue-600">{interview?.jobPosition}</h2>

      <AlertDialog  >
        <AlertDialogTrigger asChild>
          <button className="text-gray-500 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your interview record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteInterview}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    
    <p className="text-sm text-gray-600 mb-0.5">{interview?.jobExperience} Years of Experience</p>
    <p className="text-xs text-gray-500 mb-3">Created At : {interview?.createdAt.toDateString().slice(4)}</p>
    
    <div className="flex gap-3 mt-2">
      <button 
        onClick={onFeedback} 
        className="flex-1 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Feedback
      </button>
      <button 
        onClick={onStart} 
        className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        Retake
      </button>
    </div>
  </div>
  )
}

export default InterviewItemCard
