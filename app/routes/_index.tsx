import type { V2_MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Jokes app' }, { name: 'description', content: 'POC remix app with jokes' }];
};

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <main className="max-w-2xl mx-auto px-4 py-16 flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Remix POC</h1>
        <Link
          to="jokes"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 inline-flex justify-center rounded mt-4"
        >
          Jokes
        </Link>
      </main>
    </div>
  );
}
