import NextAuth from "next-auth";
import { env } from "../../../src/instances/env";
import EmailProvider from "next-auth/providers/email";
import { documentClient } from "../../../src/instances/aws";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [EmailProvider(env.emailProvider)],
  adapter: DynamoDBAdapter(documentClient),
  secret: env.aws.secretAccessKey,
});
