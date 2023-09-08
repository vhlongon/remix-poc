import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ErrorFallback } from '~/components/ErrorFallback';
import { apiClient } from './api/utils/client';
import { throwNotFound } from './api/utils/data';
import { validateParams } from './api/utils/validation';

export const loader = async ({ params }: LoaderArgs) => {
  const id = validateParams(params);

  const response = await apiClient.GET('/jokes/{id}', {
    params: {
      path: {
        id
      }
    }
  });

  if (response.error) {
    return throwNotFound();
  }

  return json(response.data, 200);
};

export const ErrorBoundary = () => {
  return <ErrorFallback />;
};

const JokeById = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <blockquote className="border-l-4 border-indigo-600 italic pl-4">
      <h2 className="text-3xl">{data.title}</h2>
      <p className="text-lg">{data.content}</p>
    </blockquote>
  );
};

export default JokeById;
