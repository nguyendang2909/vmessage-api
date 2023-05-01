import { CurrentUser } from './modules/users/users.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Node env
      NODE_ENV: 'test' | 'development' | 'production' | 'staging';
      // App
      API_PORT: number;

      //  DB POSTGRES
      POSTGRES_DB_HOST: string;
      POSTGRES_DB_PORT: string;
      POSTGRES_DB_NAME: string;
      POSTGRES_USER: string;
      POSTGRES_PASS: string;

      // Secret
      PASSWORD_SECRET_KEY: string;
      AUTH_JWT_SECRET_KEY: string;
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;

      // Google
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      // Firebase
      FIREBASE_PROJECT_ID: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_PRIVATE_KEY: string;

      // AWS
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_BUCKET_NAME: string;
    }
  }
}

declare module 'socket.io/dist/socket' {
  interface Handshake {
    user: CurrentUser;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
