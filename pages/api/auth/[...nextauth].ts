import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { DynamoDBAdapter } from '@next-auth/dynamodb-adapter';

import { env } from '../../../src/instances/env';
import { dynamoDbClient } from '../../../src/instances/aws';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [EmailProvider(env.emailProvider)],
  adapter: DynamoDBAdapter(dynamoDbClient, { tableName: 'next-auth' }),
  secret: env.aws.secretAccessKey,
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 12 * 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
});
