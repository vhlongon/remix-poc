import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
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

  return (
    <Form method="post" className="flex flex-col gap-4 w-full max-w-lg">
      <div className="flex flex-col gap-2 border-l-4 border-indigo-600 italic pl-4">
        <input
          name="title"
          className="w-full text-2xl border bg-transparent border-gray-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter a title..."
        />
        {data?.errors.title && <p className="text-red-500 text-sm">{data.errors.title}</p>}

        <textarea
          name="content"
          className="text-lg border bg-transparent border-gray-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your joke here..."
        />
        {data?.errors.content && <p className="text-red-500 text-sm">{data.errors.content}</p>}
      </div>
      <div className="flex gap-4 justify-end">
        <button
          name="intent"
          value="create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create
        </button>
      </div>
    </Form>
  );
};

export default Jokes;
