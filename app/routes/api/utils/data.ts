import { json } from '@remix-run/node';
import fs from 'fs/promises';
import path from 'path';
import data from '../data.json';
import type { components } from '../types';

type Joke = components['schemas']['NewJoke'];

export const throwNotFound = () => {
  throw json({ message: 'Not Found' }, { status: 404 });
};

const dataFilePath = path.join(__dirname, '../', 'app', 'routes', 'api', 'data.json');

export const deleteJoke = async (id: string): Promise<void> => {
  const { jokes } = data;

  const jokeIndex = jokes.findIndex((j) => j.id === id);

  if (jokeIndex === -1) {
    return throwNotFound();
  }

  const updatedJokes = [...jokes.slice(0, jokeIndex), ...jokes.slice(jokeIndex + 1)];

  await fs.writeFile(dataFilePath, JSON.stringify({ jokes: updatedJokes }, null, 2));
};

export const updateJoke = async (id: string, args: Partial<Joke>): Promise<void> => {
  const { jokes } = data;

  const jokeIndex = jokes.findIndex((j) => j.id === id);

  if (jokeIndex === -1) {
    return throwNotFound();
  }

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

  await fs.writeFile(dataFilePath, JSON.stringify({ jokes: updatedJokes }, null, 2));
};

export const createJoke = async (args: Omit<Joke, 'id'>): Promise<Joke> => {
  const { jokes } = data;

  const newJoke = {
    ...args,
    // get the last joke's id and add 1
    id: (parseInt(jokes[jokes.length - 1].id, 10) + 1).toString()
  };

  const updatedJokes = [...jokes, newJoke];

  await fs.writeFile(dataFilePath, JSON.stringify({ jokes: updatedJokes }, null, 2));

  return newJoke;
};
