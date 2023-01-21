module.exports = {
  extends: [
    "next",
    require.resolve("./react.js"),
    require.resolve("./parser.js"),
    require.resolve("./base.js"),
  ],
};
