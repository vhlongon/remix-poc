import createClient from 'openapi-fetch';
import type { paths } from '../types';

export const apiClient = createClient<paths>({
  baseUrl: ENV.API_BASE_URL
});
