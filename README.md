# TypeSafeX: A TypeScript-First Boilerplate for Building High-Quality Node.js Applications

TypeSafeX is a powerful Node.js boilerplate that comes equipped with TypeScript, Prisma ORM, and other essential tools to help you build high-quality backend applications with ease. With this boilerplate, you can focus on writing your code instead of configuring your project, giving you more time to build awesome features.

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

- TypeScript: TypeSafeX is built with TypeScript, a powerful and expressive language that adds static typing to JavaScript, making it more reliable and easier to debug.
- Prisma ORM: TypeSafeX uses Prisma ORM to interact with your database, allowing you to write safe and type-safe database queries using Prisma's type-safe Query API.
- Express: TypeSafeX uses the popular Express framework to build HTTP servers, making it easy to handle HTTP requests and build robust APIs.
- Helmet: TypeSafeX uses the Helmet middleware to secure your app by setting various HTTP headers.
- Morgan: TypeSafeX uses Morgan to log HTTP requests and responses.
- Dotenv: TypeSafeX uses Dotenv to load environment variables from a `.env` file.
- CORS: TypeSafeX uses the CORS middleware to enable Cross-Origin Resource Sharing.
- Method-Override: TypeSafeX uses Method-Override to override the HTTP method of a request.
- Express-Validation: TypeSafeX uses Express-Validation to validate HTTP requests.

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

## License

TypeSafeX is licensed under the ISC license. See the LICENSE file for more information.
