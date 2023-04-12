import { Router, Request, Response } from "express";
import passport from "../../auth/passport";
import prisma from "../../../prisma";
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");

const authRouter = Router();

// Local Register
authRouter.post("/register", async (req: Request, res: Response, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.send({ user });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

// Local Login
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) throw err;
    if (!user) res.send("User not found.");
    else {
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.send({ ...user });
      });
    }
  })(req,res,next);
});


// Google Login
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    res.redirect("/");
  }
);

// Facebook Login
authRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    res.redirect("/");
  }
);

// Logout
authRouter.get("/logout", (req: Request, res: Response, next) => {
  req.logout((err) => {
    if (err) return next(err);
    else {
      res.sendStatus(200)
    }
  });
});

export default authRouter;
