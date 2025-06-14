"use client"
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviweQuestions, activeQuestionIndex, setActiveQuestionIndex}) {
    const textToSpeech = (text) => {
        if('speechSynthesis' in window){
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert("Sorry, your browser does not support text-to-speech functionality");
        }
    }

    if (!mockInterviweQuestions) return <div className="animate-pulse p-5 border rounded-lg my-10 border-slate-300">Loading questions...</div>;

    return (
        <div className="p-6 bg-white border rounded-xl shadow-sm border-slate-200 h-full">
            <div className="mb-6">
                <h2 className="font-semibold text-xl text-slate-800 mb-3">Interview Questions</h2>
                <div className="flex flex-wrap gap-2">  
                    {mockInterviweQuestions.map((question, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveQuestionIndex(index)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center 
                                ${activeQuestionIndex === index 
                                    ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            Q{index + 1}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg text-slate-800">Question {activeQuestionIndex + 1}</h3>
                    <button 
                        onClick={() => textToSpeech(mockInterviweQuestions[activeQuestionIndex]?.question)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                        aria-label="Listen to question"
                    >
                        <Volume2 size={18} />
                        <span className="text-sm font-medium">Listen</span>
                    </button>
                </div>
                
                <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                    {mockInterviweQuestions[activeQuestionIndex]?.question}
                </p>
                
            </div>

            {/* information  */}
                <div className="bg-blue-50 border-l-4 border-blue-500 mt-6 p-4 rounded">
                    <div className="flex items-start">
                        <Lightbulb className="text-blue-600 shrink-0 mt-1" size={20} />
                        <div className="ml-3">
                            <h4 className="font-semibold text-blue-800">Information</h4>
                            <p className="text-blue-700 text-sm mt-1">
                                Click on &quot;Record Answer&quot; when you&apos;re ready to respond to this question. 
                                At the end of the interview, we&apos;ll provide feedback on your answers with comparison 
                                to ideal responses for each question.
                            </p>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default QuestionsSection 