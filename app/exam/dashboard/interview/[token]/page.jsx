"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import { CandidateSession } from '@/utils/schema';
import { eq } from 'drizzle-orm';

function CandidateInterviewRedirect() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.token) {
      validateTokenAndRedirect();
    }
  }, [params.token]);

  const validateTokenAndRedirect = async () => {
    try {
      // Get candidate session
      const sessionResult = await db
        .select()
        .from(CandidateSession)
        .where(eq(CandidateSession.uniqueToken, params.token));

      if (!sessionResult || sessionResult.length === 0) {
        // Invalid token
        setLoading(false);
        return;
      }

      const session = sessionResult[0];

      // Check if already completed
      if (session.status === 'completed') {
        router.push(`/dashboard/interview/${session.mockId}/feedback?candidate=${params.token}`);
        return;
      }

      // Redirect to admin interview page with candidate mode
      router.push(`/dashboard/interview/${session.mockId}?candidate=${params.token}`);
      
    } catch (error) {
      console.error('Error validating token:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating interview link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.664 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Interview Link</h2>
        <p className="text-gray-600 mb-4">The interview link you accessed is invalid or has expired.</p>
        <p className="text-sm text-gray-500">
          Please contact the admin if you believe this is an error.
        </p>
      </div>
    </div>
  );
}

export default CandidateInterviewRedirect; 