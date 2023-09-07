import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import schema from './schema.json';

export const loader = async ({ request }: LoaderArgs) => {
  const { info, servers } = schema;
  return json({ info, servers }, 200);
};

export default function SchemaPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>{data.info.title}</h1>
      <ul>
        {data.servers.map(({ url, description }) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noreferrer">
              {description}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
