module.exports = {
  apps: [
    {
      name: "backend",
      script: "index.js",
      cwd: "./backend",
      watch: false,
    },
    {
      name: "frontend",
      script: "npm",
      args: "start",
      cwd: ".",
      watch: false,
    },
  ],
};
