import { z } from 'zod';

const envSchema = z.object({
  API_BASE_URL: z.string({ required_error: 'API_BASE_URL is not set' })
});

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}

export const getEnv = () => {
  const env = envSchema.parse(process.env);

  return env;
};

export type ENV = ReturnType<typeof getEnv>;
