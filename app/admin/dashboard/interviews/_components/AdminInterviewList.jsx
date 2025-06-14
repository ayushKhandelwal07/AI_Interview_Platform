"use client"
import React, { useState } from 'react';
import { useAdminInterviews } from '@/hooks/useAdminInterviews';
import { 
  Eye, 
  Link as LinkIcon, 
  Calendar, 
  User, 
  Filter,
  Copy,
  Edit,
  Trash2,
  ExternalLink,   
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AdminInterviewList() {
  const { 
    interviews: allInterviews, 
    loading, 
    deleteInterview, 
    updateLinkStatus,
    activeInterviews,
    inactiveInterviews 
  } = useAdminInterviews();
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Filter interviews based on status
  const interviews = statusFilter === 'all' 
    ? allInterviews 
    : allInterviews.filter(interview => interview.linkStatus === statusFilter);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };



  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Status Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <div className="flex space-x-5">
            <Button
            className="bg-indigo-600 text-white hover:text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All ({allInterviews.length})
            </Button>
            <Button
            className="bg-indigo-600 text-white hover:text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
            >
              Active ({activeInterviews})
            </Button>
            <Button
            className="bg-indigo-600 text-white hover:text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive ({inactiveInterviews})
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {interviews.length} interview{interviews.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Interview Table */}
      {interviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
          <p className="text-gray-500">
            {statusFilter === 'all' 
              ? "You haven't created any interviews yet." 
              : `No ${statusFilter} interviews found.`
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interview Details
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interview Link
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                   <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Actions
                   </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interviews.map((interview) => (
                  <tr key={interview.mockId} className="hover:bg-gray-50">
                    {/* Interview Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {interview.jobPosition}
                          </div>
                          <div className="text-sm text-gray-500">
                            {interview.jobExperience} years experience
                          </div>
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {interview.jobDesc}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(interview.linkStatus)}
                    </td>

                    {/* Interview Link */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4 text-gray-400" />
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {interview.link ? '.../' + interview.mockId.slice(-8) : 'No link'}
                          </code>
                        </div>
                        {interview.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(interview.link)}
                            className="h-6 w-6 p-0 bg-indigo-600 hover:text-white text-white hover:bg-indigo-700 rounded"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      <div className="flex items-center justify-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(interview.createdAt)}</span>
                      </div>
                    </td>

                    {/* Candidate */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {interview.candidateEmail ? (
                        <div className="flex items-center justify-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{interview.candidateEmail}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not assigned</span>
                      )}
                    </td>

            

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">

                        {/* Toggle Status */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateLinkStatus(
                            interview.mockId, 
                            interview.linkStatus === 'active' ? 'inactive' : 'active'
                          )}
                          className={interview.linkStatus === 'active' 
                            ? 'bg-orange-600 text-white hover:text-white hover:bg-orange-700 rounded-xl' 
                            : 'bg-emerald-600 text-white hover:text-white hover:bg-emerald-700 rounded-xl'
                          }
                        >
                          {interview.linkStatus === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>

                        {/* Delete Interview */}
                        <AlertDialog className="bg-white">
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="bg-red-600 text-white hover:bg-red-700 rounded-xl hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Interview</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this interview for "{interview.jobPosition}"? 
                                This action cannot be undone and will also remove the associated interview link.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteInterview(interview.mockId)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInterviewList; 