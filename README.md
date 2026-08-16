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

- [Next.js 16](https://nextjs.org/) - React framework for server-rendered applications
- [React 19](https://reactjs.org/) - UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Material UI 9](https://mui.com/) - React component library
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

Create a `.env` file in the repository root. Next.js loads it natively, before
`next.config.mjs` is evaluated. These are the names the code actually reads — see
`src/instances/env.ts`:

```
# AWS
S3_BUCKET=your-bucket-name
S3_REGION=your-region
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key

# App
APP_TITLE=Your App
APP_LOGO_URL=https://.../logo.png
APP_ICON_URL=https://.../icon.png

# Content lookup
CONTENT_API_URL=https://...
CONTENT_INVALID_WORDS=ita,eng,epub

# Email
EMAIL_SIGNATURE=Your App <noreply@example.com>
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=noreply@example.com
EMAIL_PASSWORD=your-password

# Converter
CONVERTER_API_URL=https://.../
CONVERTER_API_KEY=your-key
CONVERTER_API_HEADER=x-oc-api-key
CONVERTER_API_EXTENSION=pdf,epub,mobi

# Auth
AUTH_AUTHORIZED_EMAILS=you@example.com,someone@example.com
NEXTAUTH_URL=http://localhost:6969
```

`NEXTAUTH_SECRET` is deliberately not in that list: nothing reads it today.
`pages/api/auth/[...nextauth].ts` signs session JWTs with `env.aws.secretAccessKey`
instead, which is tracked in issue #20. Setting `NEXTAUTH_SECRET` currently has no effect.

**Only five of these reach the browser**: `APP_TITLE`, `APP_LOGO_URL`, `APP_ICON_URL`,
`CONTENT_INVALID_WORDS` and `NEXTAUTH_URL`, listed explicitly under `env` in
`next.config.mjs` and read through `src/instances/env.public.ts`. Everything else is
server-only and must be reached through `src/instances/env.ts`, which only server code
imports. Importing `env.ts` from a component or a hook publishes every credential in it to
every visitor — that is what issue #12 was.

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

# Run the TypeScript compiler in check-only mode
yarn typecheck
```

### Static Analysis

Two extra analysers run over the whole codebase, both configured so that every
rule they support reports as an error:

- [**react-doctor**](https://react.doctor) (`doctor.config.jsonc`) — React and
  Next.js correctness: state and effects, performance, accessibility, security.
- [**fallow**](https://docs.fallow.tools) (`.fallowrc.jsonc`) — dead code,
  unused exports and dependencies, circular imports, duplication, complexity.

```bash
# React / Next.js analysis
yarn doctor

# Dead code, cycles, duplication, complexity
yarn fallow

# The full gate: lint + typecheck + test + doctor + fallow
yarn verify
```

Fix the code rather than lowering a rule. The few exceptions already present in
both config files are commented with the reason they exist.

### Testing

The project uses [Vitest](https://vitest.dev/) with a `jsdom` environment and
[Testing Library](https://testing-library.com/) for hooks.

```bash
# Run the suite once
yarn test

# Re-run on change
yarn test:watch

# Run with coverage (fails below the threshold)
yarn test:cov
```

Tests live in the top-level `tests/` directory, mirroring the source layout. `tests/setup.ts`
populates the environment variables that `src/instances/env.ts` and `src/instances/env.public.ts`
read at import time, mocks
`nodemailer` so no SMTP connection is attempted, and polyfills `window.matchMedia`.

`yarn test:cov` enforces a **80% global threshold on lines, statements, functions and branches**
across the application's logic layer — `src/utils`, `src/classes`, `src/services`,
`src/formatters`, `src/store`, `src/hooks`, `src/instances` and `pages/api`.
React components and pages are outside the coverage scope.

## Application Structure

- `/pages` - Next.js pages and API routes
- `/pages/api` - Serverless API endpoints
- `/src` - Core application logic
- `/tests` - Vitest suite, mirroring the source layout
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
