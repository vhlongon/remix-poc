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
    <main>
      <h1 className="text-3xl font-bold mb-4 text-center">Jokes</h1>
      <ul className="space-y-4">
        {data.length > 0 ? (
          data.map((joke) => (
            <li key={joke.id} className="bg-indigo-50 rounded-lg shadow-md p-4">
              <Link prefetch="intent" to={`${joke.id}`}>
                <h2 className="text-xl font-bold mb-2">{joke.title}</h2>
                <p className="text-gray-700">{joke.content}</p>
              </Link>
            </li>
          ))
        ) : (
          <p>No jokes found</p>
        )}
      </ul>
      <Outlet />
    </main>
  );
};

export default Jokes;
