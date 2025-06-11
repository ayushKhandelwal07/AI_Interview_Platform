"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAiModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { CirclePause, Mic, Loader2 } from 'lucide-react';
import moment from 'moment/moment';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from "react-webcam";
import { toast } from 'sonner';

function RecordAnswerSection({mockInterviweQuestions, activeQuestionIndex, interviewData}) {
    const [userAnswer, setUserAnswer] = useState('');
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [timer, setTimer] = useState(null);

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        if (results && results.length > 0) {
            let newText = '';
            results.forEach((result) => {
                if (result?.transcript) {
                    newText += result.transcript + ' ';
                }
            });
            setUserAnswer(newText.trim());
        }
    }, [results]);

    useEffect(() => {
        if(isRecording) {
            const interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            setTimer(interval);
        } else {
            clearInterval(timer);
            setRecordingTime(0);
        }
        
        return () => clearInterval(timer);
    }, [isRecording]);
  
    const StartStopRecording = async () => {
        if(isRecording){
            stopSpeechToText();
            
            setTimeout(() => {
                if(userAnswer?.length < 10){
                    toast('Answer should be more than 10 words, Please record again');
                } else {
                    UpdateUserAnswer();
                }
            }, 500);
        } else {
            startSpeechToText();
            setUserAnswer('');
            setResults([]);
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const UpdateUserAnswer = async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            toast('Processing your answer...');
            
            const feedbackPrompt = "Question : " + mockInterviweQuestions[activeQuestionIndex]?.question + 
                ", User Answer:" + userAnswer + "Depend on the question and user answer for interview questions "+
                " Please give us rating from 1 to 10 for answer and feedback as area of improvement if any"+
                "in must be just 4-5 lines response with JSON format with only two fields  'rating' field and 'feedback' field remember two fields and JSON format only";

            const result = await chatSession.sendMessage(feedbackPrompt);

            const mockJosnReasponse = (result.response.text()).replace('```json','').replace('```','');
            const JsonFeedbackResp = JSON.parse(mockJosnReasponse);
            
            const resp = await db.insert(UserAnswer)
            .values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviweQuestions[activeQuestionIndex]?.question,
                correctAns: mockInterviweQuestions[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback,
                rating: JsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy')
            });
            
            if(resp) {
                toast('Answer recorded successfully!');
                setUserAnswer('');
                setResults([]);
            } else {
                toast('Failed to save answer. Please try again.');
            }
        } catch (error) {
            console.error("Error updating answer:", error);
            toast('An error occurred. Please try again.');
        } finally {
            setResults([]);
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col bg-white-900 p-6 rounded-xl border border-slate-200 shadow-sm h-full">
            <h3 className="text-xl font-medium text-black mb-6">Record Your Answer</h3>
            
            <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-300 shadow-md">
                {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center px-3 py-1 bg-red-500 text-white rounded-full z-20 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
                    </div>
                )}
                
                <div className="absolute inset-0 flex justify-center items-center z-0">
                    <Image src="/canimg.png" height={200} width={200} alt="Background" className="opacity-30" />
                </div>
                
                <Webcam 
                    mirrored={true}
                    className="h-full w-full object-cover z-10"
                />
            </div>
            
            {userAnswer.length > 0 && (
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-inner max-h-32 overflow-y-auto mt-6">
                    <h4 className="text-sm font-medium text-slate-600 mb-2">Your Answer:</h4>
                    <p className="text-slate-800">{userAnswer}</p>
                </div>
            )}
            
            <div className="flex justify-center space-x-4 rounded-lg mt-6">
                <Button 
                    disabled={loading} 
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className="flex items-center gap-2 shadow-sm transition-all duration-200"
                    onClick={StartStopRecording}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : isRecording ? (
                        <>
                            <CirclePause className="h-5 w-5" />
                            <span>Stop Recording</span>
                        </>
                    ) : (
                        <>
                            <Mic className="h-5 w-5" />
                            <span>Record Answer</span>
                        </>
                    )}
                </Button>
                
            </div>
            
            {error && (
                <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm mt-4">
                    Error: {error}. Please ensure your browser has microphone access.
                </div>
            )}
        </div>
    );
}

export default RecordAnswerSection;