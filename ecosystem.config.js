module.exports = {
  apps: [
    {
      name: "backend",
      script: "index.js",
      cwd: "./backend",
    },
    {
      name: "frontend",
      script: "npm",
      args: "start",
    },
  ],
};
