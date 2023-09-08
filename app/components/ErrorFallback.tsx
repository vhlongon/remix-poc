import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import * as React from 'react';

const isDefinitelyAnError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const ErrorContainer = ({
  children = 'There was a problem. Sorry.'
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 flex justify-center bg-red-100 pt-4 text-red-500">
        <div className="text-red-brand text-center">
          <div className="text-lg font-bold">Oh snap!</div>
          <div className="px-2 text-base">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const ErrorFallback = () => {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  const isResponseError = isRouteErrorResponse(error);

  if (isResponseError) {
    return (
      <ErrorContainer>
        <p>
          {error.statusText} {error.status}{' '}
        </p>
        <pre>{error.data}</pre>
      </ErrorContainer>
    );
  }

  // when false, this is what used to go to `ErrorBoundary`
  const message = isDefinitelyAnError(error) ? error.message : 'Unknown error';
  return (
    <ErrorContainer>
      <p>Something went wrong</p>
      <p>{message}</p>
    </ErrorContainer>
  );
};
