# 🤖 AI Interview Platform

> **BODHYA** - Revolutionize your technical hiring with AI-powered interviews

A cutting-edge AI Interview Platform that automates the candidate screening process, saving 80% of your hiring time while improving candidate experience. Built with Next.js 14, AI integration, and modern web technologies.

## 🌟 Features

### 🎯 Core Features
- **AI-Powered Interviews**: Advanced AI conducts technical interviews with human-like precision
- **Automated Screening**: Save 80% of your time with intelligent candidate evaluation  
- **Skill-Based Assessment**: Accurately assess technical skills, problem-solving abilities, and cultural fit
- **Unbiased Hiring**: Eliminate unconscious bias with objective, merit-based evaluations
- **Real-time Analysis**: Get comprehensive insights and detailed reports instantly
- **Email Integration**: Automated interview invitations with professional email templates
- **Multi-Role Support**: Separate interfaces for admins, candidates, and hiring managers

### 🛠️ Technical Features
- **Speech-to-Text**: Real-time voice recognition for natural interview experience
- **Webcam Integration**: Video recording capabilities for comprehensive assessment
- **Responsive Design**: Mobile-first approach with beautiful, modern UI
- **Database Integration**: Robust data management with Drizzle ORM and Neon DB
- **Authentication**: Secure user management with Clerk
- **Real-time Updates**: Live progress tracking and notifications

## 🚀 Live Demo

**Production URL**: [https://ai-interview-platform-je7y.vercel.app](https://ai-interview-platform-je7y.vercel.app)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API

### Backend & Database
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk
- **Email Service**: Nodemailer (Gmail SMTP)

### AI & Integrations
- **AI Model**: Google Generative AI (Gemini)
- **Speech Recognition**: react-hook-speech-to-text
- **Media**: react-webcam for video capture

### Deployment & DevOps
- **Hosting**: Vercel
- **Database**: Neon Serverless PostgreSQL
- **Environment**: Node.js 18+

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

Required accounts:
- **Google Cloud Platform** (for Gemini AI API)
- **Clerk** (for authentication)
- **Neon** (for database)
- **Gmail** (for email services)
- **Vercel** (for deployment)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-interview-platform.git
cd ai-interview-platform
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="your-neon-database-url"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Google AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"

# Email Configuration
GMAIL_USER="your-gmail-address"
GMAIL_PASSWORD="your-gmail-app-password"

# Application Configuration
NEXT_PUBLIC_NUMBER_OF_QUESTIONS="5"
NEXT_PUBLIC_APP_URL="https://ai-interview-platform-je7y.vercel.app"
```

### 4. Database Setup
```bash
# Push database schema
npm run db:push

# Open database studio (optional)
npm run db:studio
```

### 5. Run Development Server
```bash
npm run dev
```

Open [https://ai-interview-platform-je7y.vercel.app](https://ai-interview-platform-je7y.vercel.app) with your browser to see the result.

## 🗂️ Project Structure

```
ai-interview-platform/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── admin/            # Admin dashboard
│   │   └── dashboard/    # Admin management interface
│   ├── api/              # API routes
│   │   ├── applications/ # Application management
│   │   ├── forms/        # Form handling
│   │   ├── send-email/   # Email service
│   │   └── test-email/   # Email testing
│   ├── apply/            # Job application pages
│   ├── blogs/            # Blog section
│   ├── dashboard/        # User dashboard
│   ├── exam/             # Interview exam interface
│   │   └── [token]/      # Dynamic interview pages
│   ├── fonts/            # Custom fonts
│   ├── how/              # How it works page
│   ├── pricing/          # Pricing page
│   ├── role-selection/   # Role selection interface
│   ├── globals.css       # Global styles
│   ├── layout.jsx        # Root layout
│   └── page.jsx          # Home page
├── components/
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── utils/
│   ├── db.js            # Database connection
│   ├── schema.js        # Database schema
│   └── GeminiAiModel.js # AI model configuration
├── drizzle/             # Database migrations
├── public/              # Static assets
├── drizzle.config.js    # Drizzle configuration
├── middleware.js        # Next.js middleware
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies and scripts
└── tailwind.config.js   # Tailwind CSS configuration
```

## 🛣️ Routes & Pages

### Public Routes
- `/` - Landing page with platform overview
- `/how` - How it works page
- `/pricing` - Pricing information
- `/blogs` - Blog section
- `/apply` - Job application interface

### Authentication Routes
- `/sign-in` - User sign in
- `/sign-up` - User registration
- `/role-selection` - Role selection after signup

### User Dashboard Routes
- `/dashboard` - Main user dashboard
- `/dashboard/interview/[id]` - Interview management
- `/dashboard/interview/[id]/start` - Start interview
- `/dashboard/interview/[id]/feedback` - Interview feedback

### Admin Routes (Protected)
- `/admin/dashboard` - Admin main dashboard
- `/admin/dashboard/interviews` - Interview management
- `/admin/dashboard/send` - Send interview invitations
- `/admin/dashboard/analytics` - Analytics and reports

### Interview/Exam Routes
- `/exam/[token]` - Interview waiting room
- `/exam/[token]/start` - Active interview session
- `/exam/[token]/results` - Interview results
- `/exam/invalid` - Invalid token page

## 🔌 API Endpoints

### Email Services
```http
POST /api/send-email
```
Send interview invitation emails to candidates.

**Request Body:**
```json
{
  "candidateEmail": "candidate@example.com",
  "candidateName": "John Doe",
  "jobPosition": "Frontend Developer",
  "jobDesc": "React.js developer position",
  "jobExperience": "3",
  "interviewLink": "https://platform.com/exam/token123",
  "companyName": "BODHYA"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "email-message-id",
  "message": "Interview invitation sent successfully"
}
```

### Test Email
```http
POST /api/test-email
```
Test email configuration and connectivity.

### Applications
```http
GET /api/applications
POST /api/applications
PUT /api/applications/[id]
DELETE /api/applications/[id]
```
Manage job applications and candidate data.

### Forms
```http
POST /api/forms
```
Handle form submissions and data processing.

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Test user registration and login
   - Verify role-based access control
   - Check session management

2. **Interview Creation**
   - Create new interviews as admin
   - Verify AI question generation
   - Test interview link generation

3. **Email Functionality**
   - Test email sending with `/api/test-email`
   - Verify interview invitation emails
   - Check email templates and formatting

4. **Interview Flow**
   - Complete end-to-end interview process
   - Test speech-to-text functionality
   - Verify webcam integration
   - Check results generation

### Automated Testing Setup
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Environment Testing
```bash
# Test different environments
npm run build && npm start  # Production build
npm run dev                 # Development mode
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Add all environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `GMAIL_USER`
   - `GMAIL_PASSWORD`
   - `NEXT_PUBLIC_NUMBER_OF_QUESTIONS`

3. **Domain Configuration**
   - Set custom domain in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` environment variable

### Alternative Deployment Options

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t ai-interview-platform .
docker run -p 3000:3000 ai-interview-platform
```

#### Manual Server Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Database Schema
The application uses the following main tables:
- `MockInterview` - Interview configurations
- `InterviewLink` - Interview invitation links
- `InterviewAnalytics` - Interview performance data
- `CandidateSession` - Candidate session tracking
- `UserAnswer` - Candidate responses

### AI Configuration
- **Model**: Google Gemini Pro
- **Question Generation**: Dynamic based on job requirements
- **Response Analysis**: Real-time evaluation
- **Scoring**: Automated skill assessment

### Email Templates
Professional email templates with:
- Company branding
- Interview instructions
- Responsive design
- Call-to-action buttons

## 🔐 Security Features

- **Authentication**: Clerk-based secure authentication
- **Route Protection**: Middleware-based route protection
- **Data Validation**: Input validation and sanitization
- **Environment Variables**: Secure configuration management
- **HTTPS**: SSL/TLS encryption in production
- **Token-based Access**: Secure interview link generation

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: WCAG compliance
- **Modern Design**: Clean, professional interface
- **Loading States**: Skeleton loading and spinners

## 📊 Analytics & Monitoring

- **Interview Analytics**: Performance tracking
- **Candidate Insights**: Detailed evaluation reports
- **Admin Dashboard**: Comprehensive management interface
- **Real-time Updates**: Live status monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow ESLint configuration
- Use TypeScript for type safety
- Write descriptive commit messages
- Test thoroughly before submitting
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:
- **Email**: support@bodhya.com
- **Documentation**: [Project Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🎯 Roadmap

### Upcoming Features
- [ ] Video interview analysis
- [ ] Multi-language support  
- [ ] Advanced analytics dashboard
- [ ] Integration with popular ATS systems
- [ ] Mobile app development
- [ ] AI interview coaching
- [ ] Batch interview processing
- [ ] Custom branding options

## ⚡ Performance Optimization

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Redis integration for improved performance
- **CDN**: Vercel Edge Network for global distribution
- **Database**: Connection pooling and query optimization

---

**Built with ❤️ by the BODHYA Team**

Transform your hiring process today with AI-powered interviews!
