import { PrismaClient } from '@prisma/client';
import { CreateUserParams } from './types';

type Params = {
  prisma: PrismaClient;
  userModelName?: string;
  createUser?: (params: CreateUserParams) => Promise<any>;
};

type FacebookTokenData = {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
};

type GoogleTokenData = {
  name: string;
  email: string;
  sub: string;
};

type AppleTokenData = {
  name: string;
  email: string;
  sub: string;
};

type GetUserByProviderParams = {
  provider: string;
  uid: string;
  name: string;
  email: string;
  tokenData: any;
};

const externalGrantTypes = ({
  prisma,
  userModelName = 'user',
  createUser,
}: Params) => {
  const userIdentityModelName = `${userModelName}Identity`;

  const getUserByIdentity = async ({
    provider,
    uid,
  }: {
    provider: string;
    uid: string;
  }) => {
    if (!provider || !uid) return;

    const user = await prisma[userModelName as 'user'].findFirst({
      where: { identities: { some: { uid, provider } } },
    });

    return user;
  };

  const saveUserIdentity = async ({
    user,
    provider,
    uid,
    name,
    email,
  }: {
    provider: string;
    uid: string;
    name: string;
    email: string;
    user: any;
  }) => {
    return await prisma[userIdentityModelName as 'userIdentity'].create({
      data: {
        // https://github.com/prisma/prisma/issues/4652
        // [userModelName]: { connect: { id: user.id } },
        userId: user.id,
        provider,
        uid,
        name,
        email,
      },
    });
  };

  const getUserByProvider = async ({
    provider,
    uid,
    name,
    email,
    tokenData,
  }: GetUserByProviderParams) => {
    const userFromProvider = await getUserByIdentity({
      provider,
      uid,
    });
    if (userFromProvider) return userFromProvider;

    const userByEmail = await prisma[userModelName as 'user'].findUnique({
      where: { email },
    });

    if (userByEmail) {
      await saveUserIdentity({
        user: userByEmail,
        provider,
        uid,
        name,
        email,
      });

      return userByEmail;
    }

    if (!createUser) return null;

    const user = await createUser({
      email,
      name,
      provider: {
        uid,
        name,
        tokenData,
      },
    });

    await saveUserIdentity({
      user,
      provider,
      uid,
      name,
      email,
    });

    return user;
  };

  const getUserWithFacebook = async (tokenData: FacebookTokenData) => {
    const { first_name, last_name, email, id: uid } = tokenData;
    const name = [first_name, last_name].join(' ').trim();

    const user = await getUserByProvider({
      provider: 'facebook',
      uid,
      name,
      email,
      tokenData,
    });

    return user;
  };

  const getUserWithGoogle = async (tokenData: GoogleTokenData) => {
    const { name, email, sub: uid } = tokenData;

    const user = await getUserByProvider({
      provider: 'google',
      uid,
      name,
      email,
      tokenData,
    });

    return user;
  };

  const getUserWithApple = async (tokenData: AppleTokenData) => {
    const { name, email, sub: uid } = tokenData;

    const user = await getUserByProvider({
      provider: 'apple',
      uid,
      name, // Only available on first time login
      email,
      tokenData,
    });

    return user;
  };

  return {
    getUserWithFacebook,
    getUserWithGoogle,
    getUserWithApple,
  };
};

export default externalGrantTypes;