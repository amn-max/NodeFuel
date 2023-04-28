import readline from "readline";
import { program } from "commander";
import fs from "fs-extra";

const lmao = async () => {
  program.option("--model <char>", "specify the name of the model");
  program.parse(process.argv);

  const options = program.opts();

  let model = options.model;

  if (model === undefined) {
    if (process.argv.slice(2).length > 0) {
      model = process.argv.slice(2)[0];
    } else {
      console.log("Cannot find model, make sure to use --model argument");
      process.exit();
    }
  }

  console.log("Generating file...💀");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Injecting modules...🤦‍♀️");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Please wait...🤣");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const routeHandlers = `
import prisma from "../../../prisma";
import express from "express";
import asyncHandler from "express-async-handler";
const ${model}Router = express.Router();

// Get all ${model}s
${model}Router.get('/', asyncHandler(async (req, res) => {
    let ${model}s;
    if (req.params.skip && req.params.take) {
      ${model}s = await prisma.${model}.findMany({
        skip: parseInt(req.params.skip),
        take: parseInt(req.params.take),
      });
    } else {
      ${model}s = await prisma.${model}.findMany();
    }
    res.json({content:${model}s});
}));

// Get a single ${model} by ID
${model}Router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
    const ${model} = await prisma.${model}.findUnique({
      where: { id },
    });
    if (!${model}) {
      res.status(404).json({ error: '${model} not found' });
    }
    res.json({content:${model}});

}));


// Create a new ${model}
${model}Router.post('/', asyncHandler(async (req, res) => {
  const { body } = req;
    const ${model} = await prisma.${model}.create({ data: body });
    res.json({content:${model}});
 
}));


// Update an existing ${model} by ID
${model}Router.put('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const { body } = req;
    const ${model} = await prisma.${model}.update({
      where: { id },
      data: body,
    });
    res.json({content:${model}});

}));


// Delete an existing ${model} by ID
${model}Router.delete('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
    const ${model} =  await prisma.${model}.delete({
      where: { id },
      });
    if (${model}) {
      res.status(404).json({ error: '${model} not found' });
    }
    res.json({ message: '${model} deleted successfully' });
 
}))
export default ${model}Router;
`;

  function writeRouteHandlersFile(filePath: string, data: string) {
    fs.outputFile(filePath, data)
      .then(() => console.log("File created successfully! 😀"))
      .catch((err) => console.error(err));
  }

  const filePath = `src/api/routes/v1/${model}.route.ts`;

  if (fs.existsSync(filePath)) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      `${filePath} already exists. 😓 Do you want to replace it? (yes/no) `,
      (answer: string) => {
        if (answer === "yes") {
          writeRouteHandlersFile(filePath, routeHandlers);
        } else {
          console.log("File creation cancelled. 👋");
        }

        rl.close();
      }
    );
  } else {
    writeRouteHandlersFile(filePath, routeHandlers);
  }
};

lmao();
