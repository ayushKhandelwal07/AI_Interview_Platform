"use client"
import React from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Shield, Users, BarChart3, Settings, Plus, Send, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from "../../dashboard/_components/Header";
import { useAdmin } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user } = useUser();
  const { isAdmin, setIsAdmin } = useAdmin();
  const router = useRouter();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  const adminStats = [
    {
      title: "Total Interviews Created",
      value: "24",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-blue-500"
    },
    {
      title: "Candidates Interviewed",
      value: "156",
      icon: <Users className="h-8 w-8" />,
      color: "bg-green-500"
    },
    {
      title: "Pending Reviews",
      value: "8",
      icon: <Eye className="h-8 w-8" />,
      color: "bg-orange-500"
    },
    {
      title: "This Month",
      value: "+32%",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "bg-purple-500"
    }
  ];

  const quickActions = [
    {
      title: "Manage Job Forms",
      description: "Create and manage job application forms",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-blue-500",
      action: () => router.push("/admin/dashboard/forms")
    },
    {
      title: "Create New Interview",
      description: "Set up a new AI interview for candidates",
      icon: <Plus className="mh-6 w-6" />,
      color: "bg-blue-500",
      action: () => router.push("/admin/dashboard/interviews")
    },
    {
      title: "Send Interview Links",
      description: "Share interview links with candidates",
      icon: <Send className="h-6 w-6" />,
      color: "bg-green-500",
      action: () => router.push("/admin/dashboard/send")
    },
    {
      title: "View Analytics",
      description: "Check detailed performance reports",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-500",
      action: () => router.push("/admin/dashboard/analytics")
    },
  ];

  // Show loading or redirect if not admin
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
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="h-10 w-10 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user?.firstName || 'Admin'}! Manage your interview platform.
                </p>
              </div>
            </div>
          </div>
          
          {/* Admin Badge */}
          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
            Administrator
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Interviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Interviews</h3>
            <div className="space-y-4">
              {[
                { candidate: "John Doe", position: "Frontend Developer", status: "Completed", time: "2 hours ago" },
                { candidate: "Jane Smith", position: "Backend Developer", status: "In Progress", time: "4 hours ago" },
                { candidate: "Mike Johnson", position: "Full Stack Developer", status: "Pending", time: "1 day ago" },
              ].map((interview, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{interview.candidate}</p>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      interview.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {interview.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{interview.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Interviews
            </Button>
          </div>

          {/* Team Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h3>
            <div className="space-y-4">
              {[
                { name: "Sarah Wilson", role: "HR Manager", status: "Active" },
                { name: "Tom Brown", role: "Technical Lead", status: "Active" },
                { name: "Lisa Davis", role: "Recruiter", status: "Inactive" },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Manage Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 