# NodeFuel: A TypeScript-First Boilerplate for Building High-Quality Node.js Applications

NodeFuel is a powerful Node.js boilerplate that is designed to help you build high-quality backend applications with ease. It comes equipped with TypeScript, Prisma ORM, and a range of other essential tools that make it easy to get started with your project quickly. The boilerplate is built on an Express stack and has been developed with a focus on security, scalability, and flexibility.

## Project Structure

    prisma/
    ┣ migrations/
    ┗ schema.prisma
    src/
    ┣ api/
    ┃ ┣ auth/
    ┃ ┣ errors/
    ┃ ┣ middlewares/
    ┃ ┣ routes/
    ┃ ┗ services/
    ┣ config/
    ┃ ┣ express.ts
    ┃ ┣ logger.ts
    ┃ ┗ vars.ts
    ┣ helpers/
    ┃ ┗ helpers.ts
    ┣ libs/
    ┃ ┣ **mocks**/
    ┃ ┗ prisma.ts
    ┣ tests/
    ┃ ┗ services/
    ┣ views/
    ┃ ┗ error.ejs
    ┣ generator.ts
    ┗ index.ts
    tmp/
    ┗ sessions/

## Multi-Authentication Feature

In addition to its existing features, NodeFuel now supports multi-authentication using Passport. You can easily configure the boilerplate to support authentication with popular social media platforms like Google, Facebook, Twitter, and Github. This feature makes it easy to create secure applications that allow users to sign in with their social media accounts.

NodeFuel provides multi-authentication support using Passport with various providers such as Google, Facebook, Twitter, and Github. The `vars.ts` file, located in `src/config/vars.ts`, contains boolean flags for each of these providers.
To enable authentication with a particular provider, set the corresponding flag to `true`. For example, if you want to enable authentication with Google, set `useGoogleStrategy` to `true`.

Note that in order to use any of the third-party authentication strategies, you must provide valid credentials (client ID and secret) for the corresponding provider. Once you have obtained these credentials, you can set them as environment variables in your `.env` file using the following naming convention:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
TWITTER_CONSUMER_KEY=your_consumer_key
TWITTER_CONSUMER_SECRET=your_consumer_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRECT=your_client_secret
```

Replace `your_client_id`, `your_client_secret`, etc. with the corresponding values provided by the third-party provider.

With these environment variables set, NodeFuel will automatically configure Passport with the appropriate strategies and credentials, allowing you to easily implement authentication with multiple providers in your application.

## Getting Started

To get started with NodeFuel, you need to clone the repository and install its dependencies:

- `git clone https://github.com/amn-max/NodeFuel.git`
- `cd NodeFuel`
- `npm install`

Then, you can run the development server: `npm run dev`

This command will start the server in development mode and will automatically restart it when you make changes to your code.

To build your project for production, you can run: `npm run build`

This command will compile your TypeScript code to JavaScript and place it in the `build/` directory. You can then start the production server with: `npm start`

## Features

NodeFuel comes equipped with a range of powerful features that make it easy to build high-quality Node.js applications quickly and efficiently. These features include:

- TypeScript-first approach for type safety and scalability
- Built with popular stacks like Express, Prisma, and Dotenv
- API route generator script for quickly creating basic CRUD endpoints for new models
- API documentation generation with Apidoc
- Production-ready configuration with PM2 and Cross-env
- Easy project cleanup with Rimraf
- Husky for Git hooks and automated testing
- Comprehensive and easy-to-use error handling with Http-Status
- Increased security with Helmet middleware
- CORS middleware for secure cross-origin resource sharing
- Compression middleware for faster server response times
- Method-override middleware for easy HTTP method overriding
- Express-validation middleware for request validation and error handling

## API Route Generator

You can use the included API route generator script to quickly generate basic CRUD endpoints for a new model. To use the script, run the following command:

`npm run generate ModelName`

Replace `ModelName` with the name of your model. The script will generate a new file in the `src/api/routes` directory with basic route handlers for the model's CRUD operations.

Note that the script assumes that the model has already been defined in your prisma.schema file and that you have generated the Prisma client by running `npx prisma generate`.

## Session Management

This boilerplate uses Express Session middleware to manage user sessions. A local session store has been implemented using `session-file-store` package.

By default, the session middleware uses a memory store, but this can cause issues in production environments when running multiple server instances or restarting the server. Using a persistent store like session-file-store ensures that session data is stored securely and can be retrieved even if the server is restarted.

To configure session settings, edit the `config/express.ts` file. By default, the session middleware uses a secret key for signing the session ID cookie. You should change this to a unique value in production to ensure the security of user sessions.

## Testing

- `npm run test:unit`

This command will run the unit tests using the configuration file `vitest.config.unit.ts`.

If you want to run the unit tests with the UI, use the following command:

- `npm run test:unit:ui`

This command will run the unit tests using the configuration file `vitest.config.unit.ts` and display the UI in the
browser.

## Scripts

NodeFuel comes with a number of useful scripts that you can use to develop and build your app:

- `npm run dev`: Start the development server with Nodemon.
- `npm run build`: Build your app for production.
- `npm start`: Start the production server.
- `npm run lint`: Lint your TypeScript code using ESLint.
- `npm run docs`: Generate API documentation using apidoc.
- `npm run postdocs`: Open the generated API documentation in your default browser.
- `npm run validate`: Validate your code by running the linting and testing scripts.

## Contributing

If you find a bug or want to contribute to NodeFuel, feel free to open an issue or submit a pull request.

## Inspirations

- [danielfsousa/express-rest-boilerplate](https://github.com/danielfsousa/express-rest-boilerplate)

## License

[MIT License](README.md) - [Ayush Naik](https://github.com/amn-max)
