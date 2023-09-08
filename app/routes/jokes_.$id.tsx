import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ErrorFallback } from '~/components/ErrorFallback';
import { ErrorMessage } from '~/components/ErrorMessage';
import { apiClient } from './api/utils/client';
import { throwNotFound } from './api/utils/data';
import { validRequestBody, validateParams } from './api/utils/validation';

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
    return throwNotFound(id);
  }

  return json(response.data.data, 200);
};

export const action = async ({ request, params }: LoaderArgs) => {
  const id = validateParams(params);
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'edit') {
    const body = validRequestBody(Object.fromEntries(formData));

    if (body.errors) {
      return json({ errors: body.errors });
    }

    await apiClient.PATCH('/jokes/{id}', {
      params: {
        path: {
          id
        }
      },
      body: body.data
    });
  }

  if (intent === 'delete') {
    await apiClient.DELETE('/jokes/{id}', {
      params: {
        path: {
          id
        }
      }
    });
  }
  return redirect('/jokes');
};

export const ErrorBoundary = () => {
  return <ErrorFallback />;
};

const JokeById = () => {
  const values = useLoaderData<typeof loader>();
  const response = useActionData<typeof action>();
  const [hasChanged, setHasChanged] = useState(false);

  const handleOnchange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value, name } = e.target;
    const hasChanged = value.trim() !== values[name as keyof typeof values]?.trim();
    setHasChanged(hasChanged);
  };

  return (
    <div className="w-full max-w-lg">
      <Form method="post" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 border-l-4 border-indigo-600 italic pl-4">
          <input
            name="title"
            className="text-xl border bg-transparent border-gray-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            defaultValue={values.title}
            onChange={handleOnchange}
          />
          {response?.errors?.title && <ErrorMessage>{response.errors.title}</ErrorMessage>}
          <textarea
            name="content"
            className="text-lg border bg-transparent border-gray-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            defaultValue={values.content}
            onChange={handleOnchange}
          />
          {response?.errors?.content && <ErrorMessage>{response.errors.content}</ErrorMessage>}
        </div>
        <div className="flex gap-4 justify-end">
          <button
            name="intent"
            value="edit"
            disabled={!hasChanged}
            className="bg-blue-500 hover:bg-blue-700 self-end text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          >
            edit
          </button>
          <button
            name="intent"
            value="delete"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            delete
          </button>
        </div>
      </Form>
    </div>
  );
};

export default JokeById;
