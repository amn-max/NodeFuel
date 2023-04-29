import asyncHandler from "express-async-handler";
import { Router, Request, Response } from "express";
import passport from "../../auth/passport";
import prisma from "../../../prisma";
import bcrypt from "bcryptjs";
import vars from "../../../config/vars";

const authRouter = Router();

// Local Register
authRouter.post(
  "/register",
  asyncHandler(async (req: Request, res: Response, next) => {
    const { email, password } = req.body;
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            password: hashedPassword,
          },
        });
        req.logIn(user, (err) => {
          if (err) return next(err);
          res.send({
            user,
            message:
              "User has already logged in with another strategy. Password will be updated!.",
          });
        });
      } else {
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
          res.send({ content: user });
        });
      }
    } catch (error) {
      res.status(500).send({ message: "Server error" });
    }
  })
);

// Local Login
authRouter.post(
  "/login",
  asyncHandler((req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) throw err;
      if (!user) res.send({ ...err, ...info });
      else {
        req.logIn(user, (err) => {
          if (err) return next(err);
          user.password = user.password ? "true" : "false";
          res.send({ content: user });
        });
      }
    })(req, res, next);
  })
);

// Google Login
if (vars.useGoogleStrategy) {
  authRouter.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      failureMessage: true,
      failureRedirect: "/login",
    })
  );

  authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
      failureMessage: true,
    }),
    async (req: Request, res: Response) => {
      const user: any = req.user;
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      res.redirect(vars.WEB_URL!);
    }
  );
}

// Facebook Login
if (vars.useFacebookStrategy) {
  authRouter.get(
    "/facebook",
    passport.authenticate("facebook", {
      scope: ["email"],
      failureMessage: true,
    })
  );

  authRouter.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      failureRedirect: "/login",
      failureMessage: true,
    }),
    async (req: Request, res: Response) => {
      const user: any = req.user;
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      res.redirect(vars.WEB_URL!);
    }
  );
}

// Twitter Login
if (vars.useTwitterStrategy) {
  authRouter.get(
    "/twitter",
    passport.authenticate("twitter", { scope: ["email"], failureMessage: true })
  );

  authRouter.get(
    "/twitter/callback",
    passport.authenticate("twitter", {
      failureRedirect: "/login",
      failureMessage: true,
    }),
    async (req: Request, res: Response) => {
      const user: any = req.user;
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      res.redirect(vars.WEB_URL!);
    }
  );
}

// Github Login
if (vars.useGithubStrategy) {
  authRouter.get(
    "/github",
    passport.authenticate("github", {
      scope: ["user:email"],
      failureMessage: true,
    })
  );

  authRouter.get(
    "/github/callback",
    passport.authenticate("github", {
      failureRedirect: "/login",
      failureMessage: true,
    }),
    async (req: Request, res: Response) => {
      const user: any = req.user;
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      res.redirect(vars.WEB_URL!);
    }
  );
}

// Logout
authRouter.get(
  "/logout",
  asyncHandler((req: Request, res: Response, next) => {
    req.logout((err) => {
      if (err) return next(err);
      else {
        res.sendStatus(200);
      }
    });
  })
);

// on failure
authRouter.get(
  "/forward",
  asyncHandler(async (req, res, next) => {
    // redirect when any auth fails
    res.redirect(vars.WEB_URL!); // this is the home route of your frontend application
  })
);

export default authRouter;
