import prisma from "../../libs/prisma";
import passport from "passport";
export const userSerializer = () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });
      if (existingUser) {
        // Remove password property from user object
        existingUser.password = existingUser.password ? "true" : "false";
        done(null, existingUser);
      } else {
        console.log("Cannot deserialize user " + existingUser);
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  });
};
