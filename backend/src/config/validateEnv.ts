export const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`❌ Missing required env variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

// Execute validation immediately when this module is imported
validateEnv();
