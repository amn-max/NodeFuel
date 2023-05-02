import { getAllUsers } from "../../api/services/user.service";
import prisma from "../../libs/__mocks__/prisma";
import { assert, describe, expect, it, vi } from "vitest";

vi.mock("../../libs/prisma.ts");

describe("getAllUsers", () => {
  it("should return an array of users", async () => {
    const user = {
      id: 28,
      email: "ayush@gmail.com",
      name: null,
      password: "password",
      googleId: null,
      facebookId: null,
      twitterId: null,
      githubId: null,
    };
    prisma.user.findMany.mockResolvedValue([user]);
    const result = await getAllUsers();
    expect(result[0]).toBe(user);
  });
});
