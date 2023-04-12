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

These features make TypeSafeX a powerful and flexible boilerplate for building high-quality Node.js applications quickly and efficiently.

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
