import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserApplications, ApplicationForm } from '@/utils/schema';
import { eq } from 'drizzle-orm';

// POST - Submit new application
export async function POST(request) {
  try {
    const { formId, applicantName, applicantEmail, applicationData } = await request.json();

    // Validate required fields
    if (!formId || !applicantName || !applicantEmail || !applicationData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if form exists and is active
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

    if (!forms[0].isActive) {
      return NextResponse.json(
        { error: 'Form is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Insert application
    const result = await db.insert(UserApplications).values({
      formId,
      applicantName,
      applicantEmail,
      applicationData: JSON.stringify(applicationData),
      status: 'pending'
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        ...result[0],
        applicationData: typeof result[0].applicationData === 'string' 
          ? JSON.parse(result[0].applicationData) 
          : result[0].applicationData
      }
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch applications (for admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    let query = db.select({
      id: UserApplications.id,
      formId: UserApplications.formId,
      applicantName: UserApplications.applicantName,
      applicantEmail: UserApplications.applicantEmail,
      applicationData: UserApplications.applicationData,
      status: UserApplications.status,
      submittedAt: UserApplications.submittedAt,
      reviewedAt: UserApplications.reviewedAt,
      reviewedBy: UserApplications.reviewedBy,
      notes: UserApplications.notes,
      formTitle: ApplicationForm.title
    })
    .from(UserApplications)
    .leftJoin(ApplicationForm, eq(UserApplications.formId, ApplicationForm.formId))
    .orderBy(UserApplications.submittedAt);

    if (formId) {
      query = query.where(eq(UserApplications.formId, formId));
    }

    const applications = await query;

    return NextResponse.json({
      success: true,
      applications: applications.map(app => ({
        ...app,
        applicationData: typeof app.applicationData === 'string' 
          ? JSON.parse(app.applicationData) 
          : app.applicationData
      }))
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: error.message },
      { status: 500 }
    );
  }
} 