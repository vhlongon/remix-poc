import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import schema from './schema.json';

export const loader = async ({ request }: LoaderArgs) => {
  return json(schema, 200);
};
