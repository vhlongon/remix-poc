import { json } from '@remix-run/node';
import fs from 'fs/promises';
import path from 'path';
import type { components } from '../types';

type Joke = components['schemas']['Joke'];

export const throwNotFound = (id?: string) => {
  throw json({ message: id ? `Joke with id ${id} not found` : 'Not found' }, { status: 404 });
};

const getDataFilePath = () => path.join(__dirname, '../', 'app', 'routes', 'api', 'data.json');

export const getJokes = async (): Promise<Joke[]> => {
  const data = await fs.readFile(getDataFilePath(), 'utf-8');

  return JSON.parse(data).jokes;
};
export const deleteJoke = async (id: string): Promise<boolean> => {
  const jokes = await getJokes();

  const jokeIndex = jokes.findIndex((j) => j.id === id);

  const updatedJokes = [...jokes.slice(0, jokeIndex), ...jokes.slice(jokeIndex + 1)];

  await fs.writeFile(getDataFilePath(), JSON.stringify({ jokes: updatedJokes }, null, 2));

  return true;
};

export const updateJoke = async (id: string, args: Partial<Joke>): Promise<Joke> => {
  const jokes = await getJokes();

  const jokeIndex = jokes.findIndex((j) => j.id === id);

  const updatedJoke = {
    ...jokes[jokeIndex],
    ...args,
    imageUrl: args.imageUrl !== undefined ? args.imageUrl : jokes[jokeIndex].imageUrl
  };

  const updatedJokes = [
    ...jokes.slice(0, jokeIndex),
    { ...jokes[jokeIndex], ...updatedJoke },
    ...jokes.slice(jokeIndex + 1)
  ];

  await fs.writeFile(getDataFilePath(), JSON.stringify({ jokes: updatedJokes }, null, 2));

  return updatedJoke;
};

export const createJoke = async (args: Omit<Joke, 'id'>): Promise<Joke> => {
  const jokes = await getJokes();

  const newJoke = {
    ...args,
    id: (parseInt(jokes[jokes.length - 1].id, 10) + 1).toString()
  };

  const updatedJokes = [...jokes, newJoke];

  await fs.writeFile(getDataFilePath(), JSON.stringify({ jokes: updatedJokes }, null, 2));

  return newJoke;
};
