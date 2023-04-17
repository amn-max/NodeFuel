# TypeSafeX: A TypeScript-First Boilerplate for Building High-Quality Node.js Applications

TypeSafeX is a powerful Node.js boilerplate that is designed to help you build high-quality backend applications with ease. It comes equipped with TypeScript, Prisma ORM, and a range of other essential tools that make it easy to get started with your project quickly. The boilerplate is built on an Express stack and has been developed with a focus on security, scalability, and flexibility.

## Multi-Authentication Feature

In addition to its existing features, TypeSafeX now supports multi-authentication using Passport. You can easily configure the boilerplate to support authentication with popular social media platforms like Google, Facebook, Twitter, and Github. This feature makes it easy to create secure applications that allow users to sign in with their social media accounts.

TypeSafeX provides multi-authentication support using Passport with various providers such as Google, Facebook, Twitter, and Github. The `vars.ts` file, located in `src/config/vars.ts`, contains boolean flags for each of these providers.
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

With these environment variables set, TypeSafeX will automatically configure Passport with the appropriate strategies and credentials, allowing you to easily implement authentication with multiple providers in your application.

## Getting Started

To get started with TypeSafeX, you need to clone the repository and install its dependencies:

- `git clone https://github.com/amn-max/TypeSafeX.git`
- `cd TypeSafeX`
- `npm install`

Then, you can run the development server: `npm run dev`

This command will start the server in development mode and will automatically restart it when you make changes to your code.

To build your project for production, you can run: `npm run build`

This command will compile your TypeScript code to JavaScript and place it in the `build/` directory. You can then start the production server with: `npm start`

## Features

TypeSafeX comes equipped with a range of powerful features that make it easy to build high-quality Node.js applications quickly and efficiently. These features include:

- TypeScript-first approach for type safety and scalability
- Built with popular stacks like Express, Prisma, and Dotenv
- Nodemon for automatic server restarts during development
- ESLint for code linting and formatting
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

## Scripts

TypeSafeX comes with a number of useful scripts that you can use to develop and build your app:

- `npm run dev`: Start the development server with Nodemon.
- `npm run build`: Build your app for production.
- `npm start`: Start the production server.
- `npm run lint`: Lint your TypeScript code using ESLint.
- `npm run docs`: Generate API documentation using apidoc.
- `npm run postdocs`: Open the generated API documentation in your default browser.
- `npm run validate`: Validate your code by running the linting and testing scripts.

## Contributing

If you find a bug or want to contribute to TypeSafeX, feel free to open an issue or submit a pull request. We welcome contributions of all kinds, including bug fixes, documentation improvements, and feature additions.

## Inspirations

- [danielfsousa/express-rest-boilerplate](https://github.com/danielfsousa/express-rest-boilerplate)

## License

[MIT License](README.md) - [Ayush Naik](https://github.com/amn-max)
