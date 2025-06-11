"use client"
import React from 'react';
import { Calendar, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';


const HowItWorks = () => {
    const router = useRouter();

  const steps = [
    {
      title: "Set Up Your Requirements",
      description: "Define the skills, experience level, and other criteria you're looking for in candidates.",
      icon: <Calendar className="h-12 w-12 text-white" />,
      color: "bg-primary",
    },
    {
      title: "AI Conducts the Interviews",
      description: "Our AI automatically interviews candidates, asking relevant technical questions and follow-ups.",
      icon: <MessageSquare className="h-12 w-12 text-white" />,
      color: "bg-secondary",
    },
    {
      title: "Review Detailed Reports",
      description: "Get comprehensive insights on each candidate's technical skills, problem-solving approach, and more.",
      icon: <CheckCircle className="h-12 w-12 text-white" />,
      color: "bg-accent",
    },
  ];

  return (
    <section className="pb-30 bg-gradient-hero mb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-accentDark mb-4">
            How InterviewAI Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your technical hiring process
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="mb-6 flex justify-center">
                  <div className={`${step.color} h-20 w-20 rounded-full flex items-center justify-center shadow-lg`}>
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gray-200">
                      <ArrowRight className="absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center h-full">
                  <h3 className="text-xl font-semibold mb-3 text-accentDark">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Added more vertical spacing (mt-24 instead of mt-16) to fix the overlap */}
          <div className="mt-24  rounded-xl p-8  shadow-sm">
          <section 
            className="pt-28 pb-20 relative overflow-hidden rounded-xl"
            style={{
              backgroundImage: 'url(/bg.avif )',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Ready to transform your hiring process?</h3>
              <p className="text-white">Join hundreds of companies that have improved their technical hiring</p>
            </div>
            <div className="flex justify-center">
              <button onClick={()=> router.push("/dashboard")} className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-sm">
                Get Started Free
              </button>
            </div>
          </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 