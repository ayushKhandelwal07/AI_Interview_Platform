import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserApplications } from '@/utils/schema';
import { eq } from 'drizzle-orm';

// PUT - Update application status
export async function PUT(request, { params }) {
  try {
    const { applicationId } = params;
    const { status, notes, reviewedBy } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, reviewed, accepted, rejected' },
        { status: 400 }
      );
    }

    const updateData = {
      status,
      reviewedAt: new Date(),
    };

    if (notes !== undefined) updateData.notes = notes;
    if (reviewedBy !== undefined) updateData.reviewedBy = reviewedBy;

    const result = await db.update(UserApplications)
      .set(updateData)
      .where(eq(UserApplications.id, parseInt(applicationId)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully',
      application: {
        ...result[0],
        applicationData: typeof result[0].applicationData === 'string' 
          ? JSON.parse(result[0].applicationData) 
          : result[0].applicationData
      }
    });

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch specific application
export async function GET(request, { params }) {
  try {
    const { applicationId } = params;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const applications = await db.select()
      .from(UserApplications)
      .where(eq(UserApplications.id, parseInt(applicationId)))
      .limit(1);

    if (applications.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const application = applications[0];

    return NextResponse.json({
      success: true,
      application: {
        ...application,
        applicationData: typeof application.applicationData === 'string' 
          ? JSON.parse(application.applicationData) 
          : application.applicationData
      }
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application', details: error.message },
      { status: 500 }
    );
  }
} 