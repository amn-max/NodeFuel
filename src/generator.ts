import readline from "readline";
import { program } from "commander";
import fs from "fs-extra";
import { capitalizeFirstLetter } from "./helpers/helpers";
import prisma from "./libs/prisma";

const lmao = async () => {
  program.option("--model <char>", "specify the name of the model");
  program.parse(process.argv);

  const options = program.opts();

  let model = options.model;
  const primsaHere = prisma as any;
  if (model === undefined) {
    if (process.argv.slice(2).length > 0) {
      model = process.argv.slice(2)[0];
    } else {
      console.log("Cannot find model, make sure to use --model argument");
      process.exit();
    }
  }
  try {
    if (!primsaHere[model]) {
      console.log(
        "Cannot find model, make sure define model in prisma.schema file or try `npx prisma generate`"
      );
      process.exit();
    }
  } catch (err) {
    console.log(err);
    console.log(
      "Cannot find model, make sure define model in prisma.schema file or try `npx prisma generate`"
    );
    process.exit();
  }
  const cModel = capitalizeFirstLetter(model);

  console.log("Generating file...💀");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Injecting modules...🤦‍♀️");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Please wait...🤣");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const routeHandlers = `
  import express from "express";
  import asyncHandler from "express-async-handler";
  import restrictToSelf from "../middlewares/restrictToSelf";
  import {
    create${cModel},
    delete${cModel},
    getAll${cModel}s,
    get${cModel},
    update${cModel},
  } from "../services/${model}.service";
  const ${model}Router = express.Router();

// Get all ${model}s
${model}Router.get(
  "/",
  asyncHandler(async (req, res) => {
    const ${model}s = await getAll${cModel}s(req.params.skip, req.params.take);
    res.json({ content: ${model}s });
  })
);

// Get a single ${model} by ID
${model}Router.get(
  "/:id",
  restrictToSelf,
  asyncHandler(async (req, res) => {
    const ${model} = await get${cModel}(req.params.id);
    res.json({ content: ${model} });
  })
);

// Create a new ${model}
${model}Router.post(
  "/",
  asyncHandler(async (req, res) => {
    const ${model} = await create${cModel}(req.body);
    res.json({ content: ${model} });
  })
);

// Update an existing ${model} by ID
${model}Router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const ${model} = await update${cModel}(req.params.id, req.body);
    res.json({ content: ${model} });
  })
);

// Delete an existing ${model} by ID
${model}Router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const message = await delete${cModel}(req.params.id);
    res.json({ message: message });
  })
);
export default ${model}Router;

`;

  const services = `
import prisma from "../../prisma";

export const getAll${cModel}s = async (skip: any, take: any) => {
  let ${model}s;
  if (skip && take) {
    ${model}s = await prisma.${model}.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
    });
  } else {
    ${model}s = await prisma.${model}.findMany();
  }
  return ${model}s;
};

export const get${cModel} = async (${model}_id: any) => {
  const id = parseInt(${model}_id);
  const ${model} = await prisma.${model}.findUnique({
    where: { id },
  });
  if (!${model}) {
    throw "${model} not found";
  }
  return ${model};
};

export const create${cModel} = async (data: any) => {
  const ${model} = await prisma.${model}.create({ data: data });
  return ${model};
};

export const update${cModel} = async (${model}_id: any, data: any) => {
  const id = parseInt(${model}_id);
  const ${model} = await prisma.${model}.update({
    where: { id },
    data: data,
  });
  return ${model};
};

export const delete${cModel} = async (${model}_id: any): Promise<string> => {
  const id = parseInt(${model}_id);
  const ${model} = await prisma.${model}.delete({
    where: { id },
  });
  if (${model}) {
    throw "${model} not found";
  }
  return "${model} deleted successfully";
};

`;

  async function writeRouteHandlersFile(filePath: string, data: string) {
    await fs
      .outputFile(filePath, data)
      .then(() => console.log(`${filePath} created successfully! 😀`))
      .catch((err) => console.error(err));
  }

  const filePath = `src/api/routes/v1/${model}.route.ts`;
  const serviceFilePath = `src/api/services/${model}.service.ts`;

  if (await fs.existsSync(filePath)) {
    if (await fs.existsSync(serviceFilePath)) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        `${filePath} and ${serviceFilePath} already exist. 😓 Do you want to replace them? (yes/no) `,
        (answer: string) => {
          if (answer === "yes") {
            writeRouteHandlersFile(filePath, routeHandlers);
            writeRouteHandlersFile(serviceFilePath, services);
          } else {
            console.log("File creation cancelled. 👋");
          }
          rl.close();
        }
      );
    } else {
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
    }
  } else if (await fs.existsSync(serviceFilePath)) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      `${serviceFilePath} already exists. 😓 Do you want to replace it? (yes/no) `,
      (answer: string) => {
        if (answer === "yes") {
          writeRouteHandlersFile(serviceFilePath, services);
        } else {
          console.log("File creation cancelled. 👋");
        }
        rl.close();
      }
    );
  } else {
    writeRouteHandlersFile(filePath, routeHandlers);
    writeRouteHandlersFile(serviceFilePath, services);
  }
};

lmao();
