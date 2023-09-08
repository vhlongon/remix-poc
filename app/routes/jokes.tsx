import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { apiClient } from './api/utils/client';

export const loader = async () => {
  const { data } = await apiClient.GET('/jokes', {});

  return json(data?.data ?? []);
};

const Jokes = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col p-4 items-center">
      <h1 className="text-3xl font-bold mb-4 text-center">Jokes</h1>
      <ul className="flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((joke) => (
            <li key={joke.id} className="bg-indigo-50 rounded-lg shadow-md p-2">
              <Link prefetch="intent" to={`${joke.id}`}>
                <h2 className="text-xl font-bold">{joke.title}</h2>
                <p className="text-gray-500 italic">{joke.content}</p>
              </Link>
            </li>
          ))
        ) : (
          <p>No jokes found</p>
        )}
      </ul>
      <Link
        to="new"
        className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create a new joke
      </Link>
      <Outlet />
    </main>
  );
};

export default Jokes;
