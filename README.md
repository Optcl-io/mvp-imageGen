# AI-Powered Digital Content Generator

A SaaS platform that leverages OpenAI's image generation technology to create tailored digital content for businesses. Users can upload product images and provide details to generate optimized marketing assets for digital signage and social media platforms.

## Features

- **User Authentication**: Register and login with email/password or Google OAuth
- **Subscription Plans**: Free tier (1 generation per day) and paid tier (5 generations per day)
- **Image Upload**: Securely upload and store product images
- **AI Generation**: Create platform-specific marketing content using OpenAI
- **Export Options**: Download or share generated content directly to social media
- **Feedback System**: Refine generated assets based on user feedback

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Image Processing**: Sharp for image optimization
- **AI Integration**: OpenAI GPT-4o for image generation

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update with your credentials:
   ```
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/digital_content_generator"

   # Next Auth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-next-auth-secret-key"

   # JWT Secret
   JWT_SECRET="your-jwt-secret-key"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # OpenAI API Key
   OPENAI_API_KEY="your-openai-api-key"

   # File Upload Configuration
   UPLOAD_DIR="./public/uploads"
   MAX_FILE_SIZE=5242880 # 5MB

   # Subscription Tiers
   FREE_TIER_DAILY_LIMIT=1
   PAID_TIER_DAILY_LIMIT=5
   ```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Database Setup

To set up your PostgreSQL database:

```bash
# Create database migrations
npx prisma migrate dev --name init

# Seed the database with initial data (if needed)
npx prisma db seed
```

## Project Structure

```
.
├── prisma/                # Database schema and migrations
├── public/                # Static assets
│   └── uploads/           # User uploaded images
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   └── dashboard/     # User dashboard
│   ├── components/        # React components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── forms/         # Form components
│   │   └── ui/            # UI components
│   └── lib/               # Utility functions
│       ├── auth/          # Authentication utilities
│       ├── db/            # Database utilities
│       ├── openai/        # OpenAI integration
│       └── utils/         # General utilities
├── .env                   # Environment variables
└── next.config.js         # Next.js configuration
```

## License

This project is licensed under the MIT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
