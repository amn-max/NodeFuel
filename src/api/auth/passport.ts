import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as GoogleStrategy,
  StrategyOptionsWithRequest,
} from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import prisma from "../../prisma";
import bcrypt = require("bcryptjs");
import vars from "../../config/vars";

// Configure Passport.js to use a local email and password strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Compare password hash with user password
        const passwordMatch = await bcrypt.compare(password, user.password!);

        // If password doesn't match, return error
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  console.log(existingUser);
  if (existingUser) {
    // Remove password property from user object
    const { password, ...newExistingUser } = existingUser;
    done(null, newExistingUser);
  } else {
    console.log("Cannot deserialize user " + existingUser);
  }
});

// Configure Passport.js to use a Google OAuth2 strategy
if (vars.useGoogleStrategy) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:4000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const { email } = profile._json;
        if (email) {
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
        callbackURL: "http://localhost:4000/auth/facebook/callback",
        profileFields: ["id", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const { email } = profile._json;

        try {
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
        callbackURL: "http://localhost:4000/auth/twitter/callback",
        includeEmail: true, // Go to your Twitter's project "Permissions" section, click on "Edit", check "Request email address from users" and hit "Save"
      },
      async (accessToken, tokenSecret, profile, done) => {
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
      }
    )
  );
}

export default passport;
