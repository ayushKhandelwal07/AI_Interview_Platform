"use client"
import React from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from "../dashboard/_components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image';

function BlogPage() {
  const blogPosts = [
   
    {
      id: 2,
      title: "How to Prepare for an AI Interview: A Candidate's Guide",
      excerpt: "Tips and strategies to help candidates excel in AI-powered interviews, from technical preparation to understanding the AI evaluation process.",
      author: "Michael Chen",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Career Tips",
      image: "/bg.avif"
    },
    {
      id: 3,
      title: "Reducing Hiring Bias with AI: A Data-Driven Approach",
      excerpt: "Learn how AI interviews can help eliminate unconscious bias in recruitment and create a more inclusive hiring process.",
      author: "Dr. Emily Rodriguez",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Diversity & Inclusion",
      image: "/bg.avif"
    },
    {
      id: 4,
      title: "ROI of AI Interviews: Cost Savings and Efficiency Gains",
      excerpt: "Discover the tangible benefits of implementing AI-powered interviews in your recruitment strategy, including time and cost savings.",
      author: "David Park",
      date: "2024-01-08",
      readTime: "4 min read",
      category: "Business Strategy",
      image: "/bg.avif"
    },
    {
      id: 5,
      title: "Best Practices for Designing AI Interview Questions",
      excerpt: "A comprehensive guide for HR professionals on creating effective AI interview questions that accurately assess candidate skills.",
      author: "Lisa Thompson",
      date: "2024-01-05",
      readTime: "8 min read",
      category: "HR Best Practices",
      image: "/bg.avif"
    },
    {
      id: 6,
      title: "The Psychology Behind AI Interviews: Understanding Candidate Experience",
      excerpt: "Exploring the psychological aspects of AI interviews and how to ensure a positive candidate experience throughout the process.",
      author: "Dr. James Wilson",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Psychology",
      image: "/bg.avif"
    }
  ];

  const categories = ["All", "AI Technology", "Career Tips", "Diversity & Inclusion", "Business Strategy", "HR Best Practices", "Psychology"];

  return (
    <div className="min-h-screen bg-gray-50">
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
                AI Interview Insights
              </h1>
              
              {/* Colorful accent line */}
              <div className="flex justify-center mb-6">
                <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 rounded-full"></div>
              </div>
              
              <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto">
                Stay updated with the latest trends, tips, and insights about AI-powered interviews. 
                Discover how artificial intelligence is transforming the future of recruitment.
              </p>
                        
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === "All" 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-10">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{post.category}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white rounded-xl">
                      Read
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8 py-3 hover:bg-gray-100 bg-white hover:text-black rounded-xl">
              Load More Articles
            </Button>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-white mx-5 rounded-xl mb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated with AI Interview Trends
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest insights, tips, and trends about AI-powered interviews delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 whitespace-nowrap rounded-2xl">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BlogPage;


/* Configure colors at https://shipixen.com/color-theme-explorer-shadcn */
// const colors = {
//   primary: {
//     lighter: "#a5b4fc",
//     light: "#818cf8",
//     main: "#6366f1",
//     dark: "#4f46e5",
//     darker: "#4338ca",
//   },
//   secondary: {
//     lighter: "#6ee7b7",
//     light: "#34d399",
//     main: "#10b981",
//     dark: "#059669",
//     darker: "#047857",
//   },
// };

// module.exports = { colors };
