
import prisma from "../../prisma";

export const getAllUsers = async (skip: any, take: any) => {
  let users;
  if (skip && take) {
    users = await prisma.user.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
    });
  } else {
    users = await prisma.user.findMany();
  }
  return users;
};

export const getUser = async (user_id: any) => {
  const id = parseInt(user_id);
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw "user not found";
  }
  return user;
};

export const createUser = async (data: any) => {
  const user = await prisma.user.create({ data: data });
  return user;
};

export const updateUser = async (user_id: any, data: any) => {
  const id = parseInt(user_id);
  const user = await prisma.user.update({
    where: { id },
    data: data,
  });
  return user;
};

export const deleteUser = async (user_id: any): Promise<string> => {
  const id = parseInt(user_id);
  const user = await prisma.user.delete({
    where: { id },
  });
  if (user) {
    throw "user not found";
  }
  return "user deleted successfully";
};

