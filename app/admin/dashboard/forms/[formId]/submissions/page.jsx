"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Users, Calendar, Mail, FileText, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from "../../../../../dashboard/_components/Header";
import { useAdmin } from '@/contexts/RoleContext';

export default function FormSubmissions() {
  const { formId } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { isAdmin } = useAdmin();
  const [form, setForm] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
    if (formId) {
      fetchFormAndApplications();
    }
  }, [isAdmin, router, formId]);

  const fetchFormAndApplications = async () => {
    try {
      // Fetch form details
      const formResponse = await fetch(`/api/forms/${formId}`);
      if (formResponse.ok) {
        const formData = await formResponse.json();
        setForm(formData.form);
      }

      // Fetch applications
      const appResponse = await fetch(`/api/applications?formId=${formId}`);
      if (appResponse.ok) {
        const appData = await appResponse.json();
        setApplications(appData.applications || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const updateApplicationStatus = async (applicationId, status, notes = '') => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
          reviewedBy: user?.emailAddresses[0]?.emailAddress
        }),
      });

      if (response.ok) {
        fetchFormAndApplications();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {form?.title} - Applications
              </h1>
              <p className="text-gray-600">
                Manage and review form submissions
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Applications <span className="text-2xl font-bold text-gray-900">{applications.length}</span></div>
            
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Pending', 
              count: applications.filter(app => app.status === 'pending').length,
              color: 'bg-yellow-500',
              icon: <Clock className="h-5 w-5" />
            },
            { 
              label: 'Reviewed', 
              count: applications.filter(app => app.status === 'reviewed').length,
              color: 'bg-blue-500',
              icon: <Eye className="h-5 w-5" />
            },
            { 
              label: 'Accepted', 
              count: applications.filter(app => app.status === 'accepted').length,
              color: 'bg-green-500',
              icon: <CheckCircle className="h-5 w-5" />
            },
            { 
              label: 'Rejected', 
              count: applications.filter(app => app.status === 'rejected').length,
              color: 'bg-red-500',
              icon: <XCircle className="h-5 w-5" />
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
          </div>
          
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">Applications will appear here once candidates start submitting.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.applicantName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {application.applicantEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => setSelectedApplication(application)}
                          size="sm"
                          className="bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1 " />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Application Details</h2>
                <Button
                  onClick={() => setSelectedApplication(null)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedApplication.applicantName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedApplication.applicantEmail}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Data</label>
                  <div className="space-y-3">
                    {Object.entries(selectedApplication.applicationData || {}).map(([key, value]) => {
                      // Handle file objects
                      const renderValue = () => {
                        if (value && typeof value === 'object' && value.name && value.size) {
                          // This is a file object
                          return (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span>{value.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(value.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                          );
                        } else if (typeof value === 'object') {
                          // Other objects - stringify them
                          return <pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>;
                        } else {
                          // Regular string/number values
                          return <span>{value || 'No data'}</span>;
                        }
                      };

                      return (
                        <div key={key} className="border border-gray-200 rounded-lg p-3">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          <div className="text-sm text-gray-900 mt-1">
                            {renderValue()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex space-x-3 pt-6">
                  <Button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'accepted')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewed')}
                    variant="outline"
                    className="flex-1"
                  >
                    Mark as Reviewed
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 