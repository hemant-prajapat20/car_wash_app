const axios = require('axios');

async function runTest() {
  const baseURL = `http://127.0.0.1:${process.env.PORT || 5002}/api/auth`;
  const testUser = {
    fullName: "Integration Tester",
    email: `test_${Date.now()}@gmail.com`,
    phone: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    password: "password123"
  };

  console.log('--- Phase 1: Signup ---');
  try {
    const signupRes = await axios.post(`${baseURL}/signup`, testUser);
    console.log('✅ Signup Success:', signupRes.data.success);
    console.log('👤 New User ID:', signupRes.data.data.id);
  } catch (err) {
    console.error('❌ Signup Failed:', err.response?.data || err.message);
    return;
  }

  console.log('\n--- Phase 2: Login with Correct Credentials ---');
  try {
    const loginRes = await axios.post(`${baseURL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login Success:', loginRes.data.success);
    console.log('🎫 Token Generated:', !!loginRes.data.data.token);
  } catch (err) {
    console.error('❌ Login Failed:', err.response?.data || err.message);
  }

  console.log('\n--- Phase 3: Login with Wrong Credentials ---');
  try {
    const wrongLogin = await axios.post(`${baseURL}/login`, {
      email: testUser.email,
      password: "wrong_password"
    });
    console.log('❌ Error: Login should have failed but succeeded');
  } catch (err) {
    console.log('✅ Expected Failure:', err.response?.data?.message);
  }
}

runTest();
