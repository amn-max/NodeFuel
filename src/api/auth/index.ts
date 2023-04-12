import { Prisma, PrismaClient } from "@prisma/client";
import {
  User,
  Token,
  RefreshToken,
  AuthorizationCode,
  Client,
  AuthorizationCodeModel,
  Falsey,
} from "oauth2-server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import externalGrantTypes from "./GrantTypes";
import { Model, CreateUserParams } from "./GrantTypes/types";
export * from "./GrantTypes/types";

const oauth2ServerModelPrisma = ({
  prisma,
  userModelName = "user", // set to user model name
  createUser,
}: {
  prisma: PrismaClient;
  userModelName?: string;
  createUser?: (params: CreateUserParams) => Promise<any>;
}): Model => {
  // Access Tokens

  const getAccessToken = async (token: string): Promise<Token | Falsey> => {
    const accessToken = await prisma.oauthAccessToken.findUnique({
      where: { token },
    });

    if (!accessToken) return;

    const result: Token = {
      accessToken: accessToken.token,
      accessTokenExpiresAt: accessToken.tokenExpiresAt || undefined,
      refreshToken: accessToken.refreshToken || undefined,
      refreshTokenExpiresAt: accessToken.refreshTokenExpiresAt || undefined,
      client: {
        id: accessToken.applicationId,
        grants: [],
      },
      user: {
        id: accessToken[`${userModelName}Id` as "userId"],
      },
    };

    if (
      accessToken.tokenExpiresAt &&
      accessToken.tokenExpiresAt <= new Date()
    ) {
      await revokeToken(result);
      return;
    }

    return result;
  };

  const getRefreshToken = async (refreshToken: string) => {
    const token = await prisma.oauthAccessToken.findUnique({
      where: { refreshToken },
      include: { application: true },
    });

    if (!token) return;
    if (!token.refreshToken) return;

    const result: RefreshToken = {
      token: token.token,
      refreshToken: token.refreshToken,
      client: {
        id: token.applicationId,
        grants: token.application.grants as string[],
        redirectUris: token.application.redirectUris as string[],
      },
      user: {
        id: token[`${userModelName}Id` as "userId"],
      },
    };

    if (
      token.refreshTokenExpiresAt &&
      token.refreshTokenExpiresAt <= new Date()
    ) {
      await revokeToken(result);
      return;
    }

    return result;
  };

  const saveToken = async (
    token: Token,
    client: Client,
    user: User
  ): Promise<Token> => {
    const scopes =
      token.scope && (Array.isArray(token.scope) ? token.scope : [token.scope]);

    await prisma.oauthAccessToken.create({
      data: {
        application: { connect: { id: client.id } },
        [userModelName as "user"]: { connect: { id: user.id } },
        token: token.accessToken,
        refreshToken: token.refreshToken,
        tokenExpiresAt: token.accessTokenExpiresAt,
        createdAt: new Date().toISOString(),
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scopes,
      },
    });

    token.client = {
      id: client.id,
      clientId: client.clientId,
      name: client.name,
      grants: [],
    };

    token.user = {
      id: user.id,
      email: user.email,
    };

    return token;
  };

  const revokeToken = async ({
    token,
  }: Token | RefreshToken): Promise<boolean> => {
    const accessToken = await prisma.oauthAccessToken.findUnique({
      where: { token },
    });
    if (!accessToken) return false;

    const result = await prisma.oauthAccessToken.delete({
      where: { id: accessToken.id },
    });

    return !!result;
  };

  // Authorization Code

  const getAuthorizationCode = async (code: string) => {
    const accessGrant = await prisma.oauthAccessGrant.findUnique({
      where: { token: code },
      include: { [userModelName as "user"]: true, application: true },
    });

    if (!accessGrant) return false;

    const result: AuthorizationCode = {
      code: accessGrant.token,
      authorizationCode: accessGrant.token,
      expiresAt: accessGrant.expiresAt,
      scope: (accessGrant.scopes as string[])[0],
      redirectUri: accessGrant.redirectUri,
      client: {
        id: accessGrant.applicationId,
        grants: accessGrant.application.grants as string[],
      },
      user: accessGrant[userModelName as "user"],
    };

    if (accessGrant.codeChallenge) {
      result.codeChallenge = accessGrant.codeChallenge;

      if (accessGrant.codeChallengeMethod) {
        result.codeChallengeMethod = accessGrant.codeChallengeMethod;
      }
    }

    if (accessGrant.expiresAt && accessGrant.expiresAt <= new Date()) {
      await revokeAuthorizationCode(result);
      return false;
    }

    return result;
  };

  const saveAuthorizationCode = async (
    code: AuthorizationCode,
    client: Client,
    user: User
  ) => {
    const scopes =
      code.scope && (Array.isArray(code.scope) ? code.scope : [code.scope]);

    const data: Prisma.OauthAccessGrantCreateArgs["data"] = {
      application: { connect: { id: client.id } },
      [userModelName as "user"]: { connect: { id: user.id } },
      token: code.authorizationCode,
      expiresAt: code.expiresAt,
      createdAt: new Date().toISOString(),
      redirectUri: code.redirectUri,
    };

    if (code.codeChallenge) {
      data.codeChallenge = code.codeChallenge;

      if (code.codeChallengeMethod) {
        data.codeChallengeMethod = code.codeChallengeMethod;
      }
    }

    await prisma.oauthAccessGrant.create({
      data,
    });

    const result: AuthorizationCode = code;

    result.client = {
      id: client.id,
      clientId: client.clientId,
      name: client.name,
      grants: client.grants,
    };

    result.user = {
      id: user.id,
      email: user.email,
    };

    return result;
  };

  const revokeAuthorizationCode = async ({ code }: AuthorizationCode) => {
    if (!code) return false;

    const accessGrant = await prisma.oauthAccessGrant.findUnique({
      where: { token: code },
    });
    if (!accessGrant) return false;

    await prisma.oauthAccessGrant.delete({
      where: { id: accessGrant.id },
    });

    return true;
  };

  // General

  // clientSecret can be undefined when grant type does not require client
  // secret
  const getClient = async (
    clientId: string,
    clientSecret?: string
  ): Promise<Client | Falsey> => {
    if (!clientId) return;

    const application = await prisma.oauthApplication.findUnique({
      where: { clientId },
    });

    if (!application) return;
    if (clientSecret && application.clientSecret.length !== clientSecret.length)
      return;

    if (
      clientSecret &&
      !crypto.timingSafeEqual(
        Buffer.from(application.clientSecret),
        Buffer.from(clientSecret)
      )
    )
      return;

    return {
      id: application.id,
      grants: application.grants as string[],
      redirectUris: application.redirectUris as string[],
      scopes: application.scopes as string[],
    };
  };

  const getUser = async (username: string, password: string) => {
    if (!username || !password) return;

    const user = await prisma[userModelName as "user"].findUnique({
      where: { email: username.toLowerCase() },
    });
    if (!user) return;
    if (!user.encryptedPassword) return;

    const validPassword = await bcrypt.compare(
      password,
      user.encryptedPassword
    );
    if (!validPassword) return;

    return user;
  };

  const validateScope = async (
    user: User,
    client: Client,
    scope: string | string[]
  ) => {
    if (client.scopes === undefined) return [];
    if (!client.scopes.length) return client.scopes;
    if (!client.scopes.includes(scope)) return false;

    return client.scopes;
  };

  const verifyScope = async (token: Token, scope: string | string[]) => {
    return true;
  };

  // External Grant Types

  return {
    getClient,
    getUser,

    getAccessToken,
    getRefreshToken,
    revokeToken,
    saveToken,

    verifyScope,

    saveAuthorizationCode,
    getAuthorizationCode,
    revokeAuthorizationCode,

    validateScope,
    prisma,
    ...externalGrantTypes({ prisma, userModelName, createUser }),
  };
};

export default oauth2ServerModelPrisma;
