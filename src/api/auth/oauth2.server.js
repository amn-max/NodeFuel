import OAuth2Server from "oauth2-server";
import oauth2ServerModelPrisma from ".";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const oAuthServer = new OAuth2Server({
  model: {
    ...oauth2ServerModelPrisma({ prisma }),
  },
  requireClientAuthentication: {
    password: false,
    refresh_token: false,
  },
  allowBearerTokensInQueryString: true,
});

export default oAuthServer;
