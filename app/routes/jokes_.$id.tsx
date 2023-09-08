import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
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

  return json(response.data.data, 200);
};

export const action = async ({ request, params }: LoaderArgs) => {
  const id = validateParams(params);

  if (request.method === 'DELETE') {
    const response = await apiClient.DELETE('/jokes/{id}', {
      params: {
        path: {
          id
        }
      }
    });

    if (response.error) {
      return throwNotFound();
    }

    return redirect('/jokes');
  }
};

export const ErrorBoundary = () => {
  return <ErrorFallback />;
};

const JokeById = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-4">
      <blockquote className="border-l-4 border-indigo-600 italic pl-4">
        <h2 className="text-3xl">{data.title}</h2>
        <p className="text-lg">{data.content}</p>
      </blockquote>
      <Form className="flex justify-end" method="delete">
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          delete
        </button>
      </Form>
    </div>
  );
};

export default JokeById;
