'use client'
import { db } from '@/utils/db';
import MockInterview from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/Questions';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

function StartInterview({params}) {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviweQuestions, setMockInterviewQuestions] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        try {
            setLoading(true);
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewid));
            
            if (result && result.length > 0) {
                const jsonMockResp = JSON.parse(result[0].jsonMockResp.replace(/```/g, ''));
                setMockInterviewQuestions(jsonMockResp);
                setInterviewData(result[0]);
            } else {
                console.error("No interview found with this ID");
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        } finally {
            setLoading(false);
        }
    }

    const goToNextQuestion = () => {
        if (activeQuestionIndex < mockInterviweQuestions.length - 1) {
            setActiveQuestionIndex(activeQuestionIndex + 1);
            window.scrollTo(0, 0);
        }
    }

    const goToPreviousQuestion = () => {
        if (activeQuestionIndex > 0) {
            setActiveQuestionIndex(activeQuestionIndex - 1);
            window.scrollTo(0, 0);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700">Loading interview questions...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    {interviewData?.title || 'Technical Interview Practice'}
                </h1>
                <p className="text-slate-600 mt-2">
                    Answer each question clearly and professionally as you would in a real interview.
                </p>
                <div className="mt-4 bg-blue-50 p-3 rounded-lg text-blue-700 text-sm flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    Question {activeQuestionIndex + 1} of {mockInterviweQuestions?.length || 0}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuestionsSection 
                    mockInterviweQuestions={mockInterviweQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                />

                <RecordAnswerSection 
                    mockInterviweQuestions={mockInterviweQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            
            <div className="mt-10 flex justify-between">
                <Button 
                    variant="outline" 
                    onClick={goToPreviousQuestion}
                    disabled={activeQuestionIndex === 0}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Previous Question
                </Button>
                
                <div>
                    {activeQuestionIndex === mockInterviweQuestions?.length - 1 ? (
                        <Link href={'/dashboard/interview/' + interviewData?.mockId + '/feedback'}>
                            <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                                <CheckCircle size={16} />
                                Complete Interview
                            </Button>
                        </Link>
                    ) : (
                        <Button 
                            onClick={goToNextQuestion}
                            className="flex items-center gap-2"
                        >
                            Next Question
                            <ArrowRight size={16} />
                        </Button>
                    )}
                </div>
            </div>
            
            <footer className="mt-8 text-center text-slate-600 text-sm">
                <p>Remember to answer truthfully and clearly. Your responses are being recorded for feedback.</p>
            </footer>
        </div>
    )
}

export default StartInterview