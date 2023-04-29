
  import express from "express";
  import asyncHandler from "express-async-handler";
  import restrictToSelf from "../../middlewares/restrictToSelf";
  import {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
  } from "../../services/user.service";
  const userRouter = express.Router();

// Get all users
userRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await getAllUsers(req.params.skip, req.params.take);
    res.json({ content: users });
  })
);

// Get a single user by ID
userRouter.get(
  "/:id",
  restrictToSelf,
  asyncHandler(async (req, res) => {
    const user = await getUser(req.params.id);
    res.json({ content: user });
  })
);

// Create a new user
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const user = createUser(req.body);
    res.json({ content: user });
  })
);

// Update an existing user by ID
userRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = updateUser(req.params.id, req.body);
    res.json({ content: user });
  })
);

// Delete an existing user by ID
userRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const message = await deleteUser(req.params.id);
    res.json({ message: message });
  })
);
export default userRouter;

