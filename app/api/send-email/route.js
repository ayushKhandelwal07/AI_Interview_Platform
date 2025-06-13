import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { 
      candidateEmail, 
      candidateName, 
      jobPosition, 
      jobDesc, 
      jobExperience, 
      interviewLink,
      companyName = "InterviewAI"
    } = await request.json();

    // Validate required fields
    if (!candidateEmail || !candidateName || !jobPosition || !interviewLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASSWORD, // Your Gmail app password
      },
    });

    // Email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Invitation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .title {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .position {
            color: #6b7280;
            font-size: 18px;
          }
          .content {
            margin: 30px 0;
          }
          .job-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2563eb;
          }
          .detail-item {
            margin: 10px 0;
          }
          .detail-label {
            font-weight: 600;
            color: #374151;
          }
          .detail-value {
            color: #6b7280;
            margin-left: 10px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            transform: translateY(-2px);
          }
          .instructions {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
          }
          .instructions h3 {
            color: #92400e;
            margin-top: 0;
          }
          .instructions ul {
            color: #78350f;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6b7280;
            font-size: 14px;
          }
          .contact-info {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">${companyName}</div>
            <h1 class="title">Interview Invitation</h1>
            <p class="position">Position: ${jobPosition}</p>
          </div>
          
          <div class="content">
            <p>Dear ${candidateName},</p>
            
            <p>Congratulations! We are pleased to invite you to participate in our AI-powered interview process for the <strong>${jobPosition}</strong> position.</p>
            
            <div class="job-details">
              <h3>Position Details:</h3>
              <div class="detail-item">
                <span class="detail-label">Role:</span>
                <span class="detail-value">${jobPosition}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Required Experience:</span>
                <span class="detail-value">${jobExperience} years</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${jobDesc}</span>
              </div>
            </div>
            
            <div class="instructions">
              <h3>Interview Instructions:</h3>
              <ul>
                <li>Find a quiet, well-lit environment for the interview</li>
                <li>Ensure stable internet connection</li>
                <li>Have your webcam and microphone ready</li>
                <li>The interview consists of multiple questions</li>
                <li>Take your time to provide thoughtful answers</li>
                <li>Speak clearly and professionally</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${interviewLink}" class="cta-button">
                🎯 Start Your Interview
              </a>
            </div>
            
            <div class="contact-info">
              <strong>Need Help?</strong><br>
              If you encounter any technical issues or have questions about the interview process, please contact us immediately.
            </div>
            
            <p>We look forward to learning more about your qualifications and discussing this exciting opportunity with you.</p>
            
            <p>Best regards,<br>
            <strong>The ${companyName} Hiring Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from ${companyName} interview platform.</p>
            <p>Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: {
        name: companyName,
        address: process.env.GMAIL_USER
      },
      to: candidateEmail,
      subject: `Interview Invitation - ${jobPosition} Position at ${companyName}`,
      html: htmlTemplate,
      text: `
        Dear ${candidateName},

        Congratulations! You have been invited to participate in our interview process for the ${jobPosition} position.

        Position Details:
        - Role: ${jobPosition}
        - Required Experience: ${jobExperience} years
        - Description: ${jobDesc}

        Interview Instructions:
        - Find a quiet, well-lit environment
        - Ensure stable internet connection
        - Have your webcam and microphone ready
        - Take your time to provide thoughtful answers

        Click here to start your interview: ${interviewLink}

        Best regards,
        The ${companyName} Hiring Team
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    return NextResponse.json(
      { 
        success: true, 
        messageId: info.messageId,
        message: 'Interview invitation sent successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error.message
      },
      { status: 500 }
    );
  }
} 