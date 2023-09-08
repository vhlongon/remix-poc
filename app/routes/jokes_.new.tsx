import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { ErrorMessage } from '~/components/ErrorMessage';
import { apiClient } from './api/utils/client';
import { validRequestBody } from './api/utils/validation';

export const action = async ({ request }: LoaderArgs) => {
  const formData = await request.formData();
  const body = validRequestBody(Object.fromEntries(formData));

  if ('errors' in body) {
    return json({ errors: body.errors });
  }

  await apiClient.POST('/jokes/new', {
    body: body
  });

  return redirect('/jokes');
};

const Jokes = () => {
  const data = useActionData<typeof action>();
  const [isDirty, setIsDirty] = useState(false);

  const handleOnchange: FormEventHandler<HTMLFormElement> = (e) => {
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const hasFields = Boolean(formData.title && formData.content);

    setIsDirty(hasFields);
  };

  return (
    <Form method="post" className="flex flex-col gap-4 w-full max-w-lg" onChange={handleOnchange}>
      <div className="flex flex-col gap-2 border-l-4 border-indigo-600 italic pl-4">
        <input
          name="title"
          className="w-full text-2xl border bg-transparent border-gray-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter a title..."
        />
        {data?.errors.title && <ErrorMessage>{data.errors.title}</ErrorMessage>}

        <textarea
          name="content"
          className="text-lg border bg-transparent border-gray-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your joke here..."
        />
        {data?.errors.content && <ErrorMessage>{data.errors.content}</ErrorMessage>}
      </div>
      <div className="flex gap-4 justify-end">
        <button
          name="intent"
          value="create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          disabled={!isDirty}
        >
          Create
        </button>
      </div>
    </Form>
  );
};

export default Jokes;
