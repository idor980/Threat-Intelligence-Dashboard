// Set dummy API keys for testing
process.env.ABUSEIPDB_API_KEY = 'test-key-abuseipdb';
process.env.IPQUALITYSCORE_API_KEY = 'test-key-ipqs';

// Silence logger during tests
process.env.LOG_LEVEL = 'silent';
