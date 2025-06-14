import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { ApplicationForm, UserApplications } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq, sql } from 'drizzle-orm';

// GET - Fetch all forms
export async function GET() {
  try {
    // First, get all forms
    const forms = await db.select()
      .from(ApplicationForm)
      .where(eq(ApplicationForm.isActive, true))
      .orderBy(ApplicationForm.createdAt);

    // For each form, get the submission count
    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const countResult = await db.select({
          count: sql`COUNT(*)`
        })
        .from(UserApplications)
        .where(eq(UserApplications.formId, form.formId));
        
        const submissionCount = Number(countResult[0]?.count) || 0;
        // console.log(`Form "${form.title}" (ID: ${form.formId}) has ${submissionCount} applications`);
        // console.log('Count query result:', countResult);
        
        return {
          ...form,
          submissionCount
        };
      })
    );

    return NextResponse.json({
      success: true,
      forms: formsWithCounts.map(form => ({
        ...form,
        fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields,
        submissionCount: form.submissionCount
      }))
    });

  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new form
export async function POST(request) {
  try {
    const { title, description, fields, createdBy } = await request.json();

    // Validate required fields
    if (!title || !fields || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields: title, fields, createdBy' },
        { status: 400 }
      );
    }

    // Generate unique form ID
    const formId = uuidv4();

    // Insert new form
    const result = await db.insert(ApplicationForm).values({
      formId,
      title,
      description: description || '',
      fields: JSON.stringify(fields),
      createdBy,
      isActive: true
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Form created successfully',
      form: {
        ...result[0],
        fields: typeof result[0].fields === 'string' ? JSON.parse(result[0].fields) : result[0].fields
      }
    });

  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Failed to create form', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update form
export async function PUT(request) {
  try {
    const { formId, title, description, fields, isActive } = await request.json();

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (fields !== undefined) updateData.fields = JSON.stringify(fields);
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    const result = await db.update(ApplicationForm)
      .set(updateData)
      .where(eq(ApplicationForm.formId, formId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Form updated successfully',
      form: {
        ...result[0],
        fields: typeof result[0].fields === 'string' ? JSON.parse(result[0].fields) : result[0].fields
      }
    });

  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json(
      { error: 'Failed to update form', details: error.message },
      { status: 500 }
    );
  }
} 