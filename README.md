# POC Remix

This is a small proof of concept for Remix using as an external api (`/api`) and an app.
The api is created using `openapi-typescript` and `openapi-fetch` so we have a type-safe api client. Read more about it [here](https://github.com/drwpow/openapi-typescript).

- data is saved to a local file in `app/routes/api/data.json` (more realistic it would be data coming from a db or a aws lamba, etc)
- the schema is located at `app/routes/api/schema/schema.json`.
- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
yarn run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
yarn run build
```

Then run the app in production mode:

```sh
yarn start
```

To re-generate the types for the api client:

```sh
yarn generate-types
```
