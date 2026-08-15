# AWS Share Files

A serverless application for secure file sharing, storage, and conversion using AWS services.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.20.16-green.svg)

## Overview

AWS Share Files is a full-stack serverless application that provides a user-friendly interface for file management in the cloud. Built with modern web technologies and AWS cloud services, it enables secure file operations while maintaining a responsive UI experience.

## Features

### File Management

- **Upload Files**: Securely upload files to Amazon S3
- **Delete Files**: Remove files from S3 storage
- **List Files**: Browse all stored files with metadata
- **Generate Shareable URLs**: Create temporary secure access links for files

### Email Management

- **Add Recipients**: Store recipient email addresses in DynamoDB
- **Edit Recipients**: Update existing recipient information
- **Delete Recipients**: Remove recipients from the database
- **Send Files**: Share uploaded files with stored recipients via email

### File Conversion

- **Format Conversion**: Convert between file formats (e.g., .docx to .pdf)
- **Get Conversion Status**: Track conversion progress

### Authentication

- **Secure Access**: Authentication powered by NextAuth.js
- **AWS Integration**: Seamless connection to AWS services

## Technology Stack

### Frontend

- [Next.js 15](https://nextjs.org/) - React framework for server-rendered applications
- [React 19](https://reactjs.org/) - UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Material UI 6](https://mui.com/) - React component library
- [React Hook Form](https://react-hook-form.com/) - Form validation and management
- [Zustand](https://github.com/pmndrs/zustand) - State management

### Backend

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless functions
- [Next Auth](https://next-auth.js.org/) - Authentication solution

### AWS Services

- [Amazon S3](https://aws.amazon.com/s3/) - Object storage for files
- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) - NoSQL database for storing email recipients
- [AWS Lambda](https://aws.amazon.com/lambda/) - Serverless computing for file processing
- [Amazon SES](https://aws.amazon.com/ses/) - Email delivery service

## Getting Started

### Prerequisites

- Node.js (version in .nvmrc)
- Yarn package manager
- AWS account with configured credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aws-share-files.git
cd aws-share-files

# Install dependencies
yarn
```

### Configuration

Create a `.env.local` file with your AWS configurations:

```
# AWS Configuration
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
AWS_DYNAMODB_TABLE=your-table-name

# Auth Configuration
NEXTAUTH_URL=http://localhost:6969
NEXTAUTH_SECRET=your-secret

# Other configurations
# ...
```

### Development

```bash
# Start the development server on port 6969
yarn dev
```

### Production Build

```bash
# Build the application for production
yarn build

# Start the production server
yarn start
```

### Linting

```bash
# Run ESLint
yarn lint
```

## Application Structure

- `/pages` - Next.js pages and API routes
- `/pages/api` - Serverless API endpoints
- `/src` - Core application logic
- `/public` - Static assets
- `/styles` - CSS and styling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More about Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
