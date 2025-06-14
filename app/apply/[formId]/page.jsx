"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Send, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApplicationFormPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data.form);
        
        // Initialize form data with empty values
        const initialData = {};
        data.form.fields.forEach(field => {
          initialData[field.id] = '';
        });
        setFormData(initialData);
      } else {
        setError('Form not found or no longer available');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      setError('Failed to load form');
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileChange = (fieldId, file) => {
    if (file) {
      // Store file information instead of the actual file object
      setFormData(prev => ({
        ...prev,
        [fieldId]: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      const requiredFields = form.fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => {
        const value = formData[field.id];
        if (field.type === 'file') {
          return !value; // For file fields, just check if file exists
        }
        return !value || value.toString().trim() === '';
      });
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: form.formId,
          applicantName: formData.name || 'Anonymous',
          applicantEmail: formData.email,
          applicationData: formData
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.id,
      value: formData[field.id] || '',
      onChange: (e) => handleInputChange(field.id, e.target.value),
      className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
      required: field.required
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows="4"
            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
          />
        );
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options && field.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'file':
        return (
          <div>
            <input
              type="file"
              id={field.id}
              onChange={(e) => handleFileChange(field.id, e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required={field.required}
              accept={field.accept || "*/*"}
            />
            {formData[field.id] && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {formData[field.id].name} ({(formData[field.id].size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            {...commonProps}
            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  if (error && !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Form Not Available</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your application. We will review your submission and get back to you soon.
          </p>
          <Button onClick={() => window.location.href = '/'} className="w-full">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-8 w-8" />
              <h1 className="text-2xl font-bold">{form.title}</h1>
            </div>
            {form.description && (
              <p className="text-blue-100">{form.description}</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {form.fields.map((field, index) => (
              <div key={field.id || index}>
                <label 
                  htmlFor={field.id} 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}

            <div className="border-t border-gray-200 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 