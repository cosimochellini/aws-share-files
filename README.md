# AWS shareable files

## Project purpose

- This project allows you to upload new files to s3
- This project allows you to add/edit/remove emails stored in a Dynamo DB instance
- This project allows you to send the files stored in s3 to the recipients on the Dynamo DB
- This project allows you to convert files on s3 into other formats, such as .docx to .pdf

## Project technologies

- [Next.js](https://nextjs.org/) + [React](https://reactjs.org/) + [Typescript](https://www.typescriptlang.org/) for the UI
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) for the serverless api
- [Material UI](https://mui.com/) for the graphic component library
- AWS ([DynamoDB](https://aws.amazon.com/dynamodb/), [S3](https://aws.amazon.com/s3/), [Lambda](https://aws.amazon.com/lambda/), [SES](https://aws.amazon.com/ses/)) for the cloud infrastructure

## Project setup

```bash
yarn
```

### Compiles and hot-reloads for development

```bash
yarn dev
```

### Compiles and minifies for production

```bash
yarn build
```

### Lints and fixes files

```bash
yarn lint
```

## Learn More about Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
