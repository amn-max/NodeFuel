import { getAllUsers } from "../../api/services/user.service";
import prisma from "../../libs/__mocks__/prisma";
import { assert, describe, it } from "vitest";

describe("getAllUsers", () => {
  it("should return an array of users", async () => {
    const result = await getAllUsers();
    assert.exists(result.length);
  });
});
