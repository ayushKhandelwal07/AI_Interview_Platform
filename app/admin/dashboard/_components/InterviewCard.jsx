import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
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

export default function InterviewCard({ 
  interview, 
  variant = 'default', // 'default', 'send', 'manage'
  onSend,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) {
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {interview.jobPosition}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {interview.jobExperience} years experience
          </p>
          <p className="text-xs text-gray-500 line-clamp-2">
            {interview.jobDesc}
          </p>
        </div>
        
        {/* Delete Button - show for all variants */}
        <div className="ml-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Interview</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the interview for "{interview.jobPosition}"? 
                  This action cannot be undone and will remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete?.(interview)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Interview
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {/* Status Badge - only show for manage variant */}
        {variant === 'manage' && interview.linkStatus && (
          <div className="ml-4">
            {getStatusBadge(interview.linkStatus)}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Created: {formatDate(interview.createdAt)}</span>
        </div>
        {interview.candidateEmail && (
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>{interview.candidateEmail}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {variant === 'send' && (
          <Button
            onClick={() => onSend?.(interview)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            <Send className="h-4 w-4 mr-2" />
            Send to Candidate
          </Button>
        )}

        {variant === 'manage' && (
          <>
            <Button
              onClick={() => onView?.(interview)}
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              onClick={() => onEdit?.(interview)}
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete?.(interview)}
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        )}

        {variant === 'default' && (
          <Button
            onClick={() => onView?.(interview)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
      </div>

      {/* Additional Info for manage variant */}
      {variant === 'manage' && interview.link && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Interview Link Available</span>
            {interview.linkCreatedAt && (
              <span>Link created: {formatDate(interview.linkCreatedAt)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 