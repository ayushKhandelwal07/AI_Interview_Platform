"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Plus, Users, Calendar, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from "../../../dashboard/_components/Header";
import { useAdmin } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';

export default function FormsManagement() {
  const { user } = useUser();
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingFormId, setDeletingFormId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    fields: [
      { id: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'phone', type: 'tel', label: 'Phone Number', required: false }
    ]
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
    fetchForms();
  }, [isAdmin, router]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/forms');
      if (response.ok) {
        const data = await response.json();
        setForms(data.forms || []);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async () => {
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newForm,
          createdBy: user?.emailAddresses[0]?.emailAddress
        }),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewForm({
          title: '',
          description: '',
          fields: [
            { id: 'name', type: 'text', label: 'Full Name', required: true },
            { id: 'email', type: 'email', label: 'Email Address', required: true },
            { id: 'phone', type: 'tel', label: 'Phone Number', required: false }
          ]
        });
        fetchForms();
      }
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const addField = () => {
    setNewForm({
      ...newForm,
      fields: [...newForm.fields, { id: Date.now().toString(), type: 'text', label: '', required: false }]
    });
  };

  const updateField = (index, field) => {
    const updatedFields = [...newForm.fields];
    updatedFields[index] = field;
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const removeField = (index) => {
    const updatedFields = newForm.fields.filter((_, i) => i !== index);
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const handleDeleteForm = async (formId, formTitle) => {
    if (window.confirm(`Are you sure you want to delete "${formTitle}"? This action cannot be undone.`)) {
      setDeletingFormId(formId);
      try {
        const response = await fetch('/api/forms', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formId,
            isActive: false
          }),
        });

        if (response.ok) {
          fetchForms(); // Refresh the forms list
        } else {
          alert('Failed to delete form');
        }
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Failed to delete form');
      } finally {
        setDeletingFormId(null);
      }
    }
  };

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Application Forms</h1>
            <p className="text-gray-600">Create and manage job application forms</p>
          </div>
          {!loading && (
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Create New Form</span>
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Forms...</h3>
            <p className="text-gray-600">Please wait while we fetch your job application forms.</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Created Yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first job application form.</p>
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2 mx-auto bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Create Your First Form</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
            <div key={form.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h- flex flex-col hover:shadow-md transition-shadow duration-200">
              {/* Header with title and actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg truncate" title={form.title}>
                    {form.title}
                  </h3>
                  <div className="h-12 overflow-hidden">
                    <p className="text-sm text-gray-600" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }} title={form.description}>
                      {form.description || 'No description provided'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => router.push(`/admin/dashboard/forms/${form.formId}/edit`)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Edit Form"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteForm(form.formId, form.title)}
                    className="text-gray-400 hover:text-red-600 p-1 disabled:opacity-50"
                    title="Delete Form"
                    disabled={deletingFormId === form.formId}
                  >
                    {deletingFormId === form.formId ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Stats section */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4 border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{form.submissionCount || 0} applications</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions - pushed to bottom */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/apply/${form.formId}`;
                    navigator.clipboard.writeText(url);
                    alert('Form link copied to clipboard!');
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl bg-white-600 text-black text-sm font-medium hover:bg-indigo-50 transition-colors"
                >
                  Copy Link
                </Button>
                <Button
                  onClick={() => router.push(`/admin/dashboard/forms/${form.formId}/submissions`)}
                  size="sm"
                  className="flex-1 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  View Applications
                </Button>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Create New Job Form</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                  <input
                    type="text"
                    value={newForm.title}
                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded-xl"
                    placeholder="e.g., Software Engineer Application"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newForm.description}
                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2  rounded-xl"
                    rows="3"
                    placeholder="Brief description of the job position..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 ">
                    <label className="block text-sm font-medium text-gray-700">Form Fields</label>
                    <Button className=" rounded-xl bg-indigo-500 text-white flex content-center hover:bg-indigo-700 hover:text-white" onClick={addField} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Field
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {newForm.fields.map((field, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(index, { ...field, label: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="Field Label"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => updateField(index, { ...field, type: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select</option>
                            <option value="file">File Upload</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(index, { ...field, required: e.target.checked })}
                            />
                            <span>Required</span>
                          </label>
                          {index > 2 && (
                            <button
                              onClick={() => removeField(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button onClick={handleCreateForm} className="flex-1 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Create Form
                </Button>
                <Button onClick={() => setShowCreateForm(false)} variant="outline" className="flex-1 bg-white-600 text-black rounded-xl text-sm font-medium hover:bg-indigo-700 hover:bng-white transition-colors">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 