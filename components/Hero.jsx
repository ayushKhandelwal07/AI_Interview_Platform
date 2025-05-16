"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Cover } from "@/components/ui/cover";

const Hero = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="pt-28 pb-20 relative overflow-hidden rounded-xl"
      unoptimized={true}
      priority={true}
      quality={100}
      style={{
        backgroundImage: 'url(/bg.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'high-quality',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Overlay for better text visibility */}
      
      {/* Content with higher z-index */}
      <div className="w-full relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-8xl text-oneline text-white font-bold text mb-6 leading-tight">
              <span className="bg-clip-text text-white bg-gradient-primary whitespace-nowrap text-ellipsis">AI Interview Platform</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
              Automatically screen and interview candidates with our AI platform. Save 80% of your time while improving candidate experience.
            </p>
      
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => isSignedIn ? router.push("/dashboard") : router.push("sign-in") } size="lg" className="bg-primary rounded-xl hover:bg-primary/90 text-white px-8 py-6 text-lg font-medium">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={scrollToFeatures}
                size="lg" 
                variant="outline" 
                className="rounded-xl border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg font-medium"
              >
                Watch Demo
              </Button>
            </div>                
            </div>
          </div>
        </div>
    </section>
  );
};

export default Hero; 