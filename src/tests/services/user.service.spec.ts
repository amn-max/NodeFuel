import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./../../api/services/user.service";
import assert from "assert";

describe("User API", function () {
  let user: any;

  before(async function () {
    // Create a user to test with
    user = await createUser({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
  });

  after(async function () {
    // Delete the user created for testing
    await deleteUser(user.id);
  });

  describe("getAllUsers", function () {
    it("should return an array of users", async function () {
      const users = await getAllUsers();
      assert(Array.isArray(users));
    });

    it("should return a subset of users when skip and take are provided", async function () {
      const users = await getAllUsers(1, 2);
      assert.equal(users.length, 2);
    });
  });

  describe("getUser", function () {
    it("should return a user by id", async function () {
      const result = await getUser(user.id);
      assert.deepStrictEqual(result, user);
    });

    it("should throw an error if user is not found", async function () {
      try {
        await getUser(-1);
      } catch (error) {
        assert.equal(error, "user not found");
      }
    });
  });

  describe("createUser", function () {
    it("should create a new user", async function () {
      const result = await createUser({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password456",
      });
      assert(result.id);
    });
  });

  describe("updateUser", function () {
    it("should update a user by id", async function () {
      const result = await updateUser(user.id, { name: "Johnny Doe" });
      assert.equal(result.name, "Johnny Doe");
    });
  });

  describe("deleteUser", function () {
    it("should delete a user by id", async function () {
      const result = await deleteUser(user.id);
      assert.equal(result, "user deleted successfully");
    });

    it("should throw an error if user is not found", async function () {
      try {
        await deleteUser(-1);
      } catch (error) {
        assert.equal(error, "user not found");
      }
    });
  });
});
