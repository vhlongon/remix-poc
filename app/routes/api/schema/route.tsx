import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import schema from '~/schema.api.json';

export const loader = async ({ request }: LoaderArgs) => {
  return json(schema, 200);
};
