import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { ApplicationForm } from '@/utils/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch specific form by ID
export async function GET(request, { params }) {
  try {
    const { formId } = params;

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    const forms = await db.select()
      .from(ApplicationForm)
      .where(eq(ApplicationForm.formId, formId))
      .limit(1);

    if (forms.length === 0) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    const form = forms[0];

    // Check if form is active
    if (!form.isActive) {
      return NextResponse.json(
        { error: 'Form is no longer available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      form: {
        ...form,
        fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields
      }
    });

  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form', details: error.message },
      { status: 500 }
    );
  }
} 