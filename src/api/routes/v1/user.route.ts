import prisma from "../../../prisma";
import express from "express";
import asyncHandler from "express-async-handler";
const userRouter = express.Router();

// Get all users
userRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    let users;
    if (req.params.skip && req.params.take) {
      users = await prisma.user.findMany({
        skip: parseInt(req.params.skip),
        take: parseInt(req.params.take),
      });
    } else {
      users = await prisma.user.findMany();
    }
    res.json({ content: users });
  })
);

// Get a single user by ID
userRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      res.status(404).json({ error: "user not found" });
    }
    res.json({ content: user });
  })
);

// Create a new user
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { body } = req;
    const user = await prisma.user.create({ data: body });
    res.json({ content: user });
  })
);

// Update an existing user by ID
userRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { body } = req;
    const user = await prisma.user.update({
      where: { id },
      data: body,
    });
    res.json({ content: user });
  })
);

// Delete an existing user by ID
userRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.user.delete({
      where: { id },
    });
    if (user) {
      res.status(404).json({ error: "user not found" });
    }
    res.json({ message: "user deleted successfully" });
  })
);
export default userRouter;
