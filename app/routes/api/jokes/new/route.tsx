import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { paths } from '../../types';
import { createJoke } from '../../utils/data';
import { validRequestBody } from '../../utils/validation';

type PostResponse = paths['/jokes/new']['post']['responses']['200']['content']['application/json'];

export const action = async ({ request }: LoaderArgs) => {
  if (request.method === 'POST') {
    const body = validRequestBody(await request?.json());

    if (body.errors) {
      throw json({ errors: body.errors }, 400);
    }
    const response: PostResponse = { data: await createJoke(body.data) };

    return json(response, 200);
  } else {
    return json({});
  }
};
