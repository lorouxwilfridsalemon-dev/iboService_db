module.exports = {
  apps : [{
    name: "test_api_guce",
    script: 'dist/main.js',
    watch: false,
    autorestart: true,
    instances: 4,
    max_memory_restart: "2G",
    env: {
       NODE_ENV: "development"
    },
    env_production: {
       NODE_ENV: "production"
    }
  }]
};