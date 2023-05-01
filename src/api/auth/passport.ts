import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import {
  Strategy as TwitterStrategy,
  Profile as TwitterProfile,
} from "passport-twitter";
import {
  Profile as GithubProfile,
  Strategy as GitHubStrategy,
} from "passport-github2";
import prisma from "../../libs/prisma";
import bcrypt from "bcryptjs";
import vars from "../../config/vars";
import { userSerializer } from "./userSerializer";

//init serializer
userSerializer();

// Configure Passport.js to use a local email and password strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        if (!req.user) {
          // Not logged-in. Authenticate based on Local strategy.
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user || !password || !user.password) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          // Compare password hash with user password

          const passwordMatch = await bcrypt.compare(password, user.password);

          // If password doesn't match, return error
          if (!passwordMatch) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          return done(null, user);
        } else {
          // Logged in. Associate Local account with user.  Preserve the login
          // state by supplying the existing user after association.
          // return done(null, req.user);
          const ruser: any = req.user;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const user = await prisma.user.update({
            where: {
              id: ruser.id,
            },
            data: {
              password: hashedPassword,
            },
          });
          user.password = user.password ? "true" : "false";
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Configure Passport.js to use a Google OAuth2 strategy
if (vars.useGoogleStrategy) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:4000/v1/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, token, tokenSecret, profile: GoogleProfile, done) => {
        // check if google id already exists
        const existingGoogleId = await prisma.user.findUnique({
          where: {
            googleId: profile.id,
          },
        });
        // return if existing
        if (existingGoogleId) return done(null, existingGoogleId);
        const { email } = profile._json;
        if (!req.user && email) {
          // Not logged-in. Authenticate based on Google account or check existing email in database.
          try {
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });

            if (existingUser) {
              // User already exists, map the existing user to the Google account
              await prisma.user.update({
                where: { email },
                data: { googleId: profile.id },
              });

              return done(null, existingUser);
            } else {
              // User does not exist, create a new user with the Google account
              const newUser = await prisma.user.create({
                data: {
                  email,
                  googleId: profile.id,
                },
              });

              return done(null, newUser);
            }
          } catch (err: any) {
            return done(err);
          }
        } else {
          // Logged in. Associate Google account with user.  Preserve the login
          // state by supplying the existing user after association.
          // return done(null, req.user);
          const user: any = req.user;
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              googleId: profile.id,
            },
          });

          return done(null, req.user);
        }
      }
    )
  );
}

// Configure Passport.js to use a Facebook strategy
if (vars.useFacebookStrategy) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID!,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        callbackURL: "http://localhost:4000/v1/auth/facebook/callback",
        profileFields: ["id", "email"],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // check if facebook id already exists
          const existingFacebookId = await prisma.user.findUnique({
            where: {
              facebookId: profile.id,
            },
          });
          // return if existing
          if (existingFacebookId) return done(null, existingFacebookId);

          if (!req.user) {
            // Not logged-in. Authenticate based on Facebook account.
            const { email } = profile._json;
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });

            if (existingUser) {
              // User already exists, map the existing user to the Facebook account
              await prisma.user.update({
                where: { email },
                data: { facebookId: profile.id },
              });

              return done(null, existingUser);
            } else {
              // User does not exist, create a new user with the Facebook account

              const newUser = await prisma.user.create({
                data: {
                  email,
                  facebookId: profile.id,
                },
              });

              return done(null, newUser);
            }
          } else {
            // Logged in. Associate Facebook account with user.  Preserve the login
            // state by supplying the existing user after association.
            // return done(null, req.user);

            const user: any = req.user;
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                facebookId: profile.id,
              },
            });
            return done(null, req.user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// Configure Passport.js to use a Twitter strategy
if (vars.useTwitterStrategy) {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY!,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
        callbackURL: "http://localhost:4000/v1/auth/twitter/callback",
        includeEmail: true, // Go to your Twitter's project "Permissions" section, click on "Edit", check "Request email address from users" and hit "Save",
        passReqToCallback: true,
      },
      async (req, accessToken, tokenSecret, profile: TwitterProfile, done) => {
        // check if twitter id already exists
        const existingTwitterId = await prisma.user.findUnique({
          where: {
            twitterId: profile.id,
          },
        });

        // return if existing
        if (existingTwitterId) return done(null, existingTwitterId);
        if (!req.user) {
          // Not logged-in. Authenticate based on Twitter account or check existing email in database.
          const { email } = profile._json;
          try {
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });
            if (existingUser) {
              // User already exists, map the existing user to the Twitter account
              await prisma.user.update({
                where: { email },
                data: { twitterId: profile.id },
              });

              return done(null, existingUser);
            } else {
              // User does not exist, create a new user with the Twitter account
              const newUser = await prisma.user.create({
                data: {
                  email,
                  twitterId: profile.id,
                },
              });

              return done(null, newUser);
            }
          } catch (err) {
            return done(err);
          }
        } else {
          // Logged in. Associate Twitter account with user.  Preserve the login
          // state by supplying the existing user after association.
          // return done(null, req.user);
          const user: any = req.user;
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              twitterId: profile.id,
            },
          });
          return done(null, req.user);
        }
      }
    )
  );
}

// Configure Passport.js to use a Github strategy
if (vars.useGithubStrategy) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRECT!,
        callbackURL: "http://localhost:4000/v1/auth/github/callback",
        passReqToCallback: true,
      },
      async (
        req: any,
        accessToken: any,
        refreshToken: any,
        profile: GithubProfile,
        done: any
      ) => {
        try {
          // check if github id already exists
          const existingGithubId = await prisma.user.findUnique({
            where: {
              githubId: profile.id,
            },
          });

          // return if existing
          if (existingGithubId) return done(null, existingGithubId);
          if (!req.user) {
            // Not logged-in. Authenticate based on Github account.
            const newUser = await prisma.user.upsert({
              create: {
                githubId: profile.id,
              },
              where: {
                githubId: profile.id,
              },
              update: {
                githubId: profile.id,
              },
            });
            return done(null, newUser);
          } else {
            // Logged in. Associate Github account with user.  Preserve the login
            // state by supplying the existing user after association.
            // return done(null, req.user);
            const user: any = req.user;
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                githubId: profile.id,
              },
            });
            return done(null, req.user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

export default passport;
