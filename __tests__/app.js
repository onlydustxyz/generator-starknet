"use strict";
const path = require("path");
const helpers = require("yeoman-test");

describe("generator-starknet:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({});
  });

  it("creates files", () => {
    // TODO: implement it
  });
});
