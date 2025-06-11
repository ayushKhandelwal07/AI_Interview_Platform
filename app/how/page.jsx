"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, UserPlus, MessageSquare, BarChart3, Play, CheckCircle, Clock, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Header from "../dashboard/_components/Header";
import Footer from "@/components/Footer";

export default function HowItWork() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const workflows = [
    {
      title: "For Administrators",
      subtitle: "Create and manage interviews effortlessly",
      icon: <Users className="h-16 w-16 text-white" />,
      color: "bg-blue-600",
      steps: [
        {
          step: "1",
          title: "Create Interview",
          description: "Set up interview questions, job roles, and evaluation criteria through our intuitive dashboard.",
          icon: <UserPlus className="h-8 w-8" />
        },
        {
          step: "2", 
          title: "Send to Candidates",
          description: "Share interview links with candidates via email or direct sharing with custom instructions.",
          icon: <MessageSquare className="h-8 w-8" />
        },
        {
          step: "3",
          title: "Monitor Progress",
          description: "Track interview completion status and candidate progress in real-time.",
          icon: <Clock className="h-8 w-8" />
        },
        {
          step: "4",
          title: "Review Results",
          description: "Access detailed analytics, scores, and AI-generated insights for each candidate.",
          icon: <BarChart3 className="h-8 w-8" />
        }
      ]
    },
    {
      title: "For Candidates",
      subtitle: "Simple and stress-free interview experience",
      icon: <MessageSquare className="h-16 w-16 text-white" />,
      color: "bg-green-600",
      steps: [
        {
          step: "1",
          title: "Try Demo Interview",
          description: "Practice with our demo interview to get familiar with the AI interview process.",
          icon: <Play className="h-8 w-8" />
        },
        {
          step: "2",
          title: "Receive Interview Link",
          description: "Get your personalized interview link from the recruiter or company.",
          icon: <MessageSquare className="h-8 w-8" />
        },
        {
          step: "3",
          title: "Complete Interview",
          description: "Answer AI-generated questions through voice or text in a natural conversation.",
          icon: <CheckCircle className="h-8 w-8" />
        },
        {
          step: "4",
          title: "Get Feedback",
          description: "Receive instant feedback and insights about your performance.",
          icon: <Star className="h-8 w-8" />
        }
      ]
    }
  ];

  const benefits = [
    {
      title: "80% Time Savings",
      description: "Automate initial screening and focus on top candidates",
      icon: <Clock className="h-10 w-10 text-blue-600" />
    },
    {
      title: "Consistent Evaluation",
      description: "AI ensures fair and unbiased assessment for all candidates",
      icon: <CheckCircle className="h-10 w-10 text-green-600" />
    },
    {
      title: "Better Experience",
      description: "Candidates can interview anytime, anywhere at their convenience",
      icon: <Star className="h-10 w-10 text-purple-600" />
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="pt-28 pb-20 relative overflow-hidden rounded-xl mx-5"
        style={{
          backgroundImage: 'url(/bg.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
                How Our AI Interview Platform Works
              </h1>
              
              <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto">
                Discover how our AI-powered interview platform revolutionizes hiring for both administrators and candidates. 
                From creating interviews to delivering results, see the complete workflow.
              </p>
        
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-in")} 
                  size="lg" 
                  className="bg-primary rounded-xl hover:bg-primary/90 text-white px-8 py-6 text-lg font-medium"
                >
                  Start Creating Interviews
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => router.push("/dashboard")}
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-medium"
                >
                  Try Demo Interview
                </Button>
              </div>                
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Sections */}
      <div className="mx-5 py-20">
        {workflows.map((workflow, workflowIndex) => (
          <section key={workflowIndex} className="mb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Workflow Header */}
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <div className={`${workflow.color} h-24 w-24 rounded-full flex items-center justify-center shadow-lg`}>
                    {workflow.icon}
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {workflow.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {workflow.subtitle}
                </p>
              </div>

              {/* Workflow Steps */}
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {workflow.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="relative">
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
                        <div className="flex justify-center mb-4">
                          <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                            {step.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 mx-5 rounded-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the benefits that make our AI interview platform the preferred choice
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg text-center">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 mx-5 rounded-xl mt-10"
        style={{
          backgroundImage: 'url(/bg.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Join hundreds of companies that have revolutionized their technical hiring with our AI platform
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-in")} 
              size="lg" 
              className="bg-primary rounded-xl hover:bg-primary/90 text-white px-8 py-6 text-lg font-medium"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => router.push("/dashboard")}
              size="lg" 
              variant="outline" 
              className="rounded-xl border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-medium"
            >
              Try Demo Interview
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}