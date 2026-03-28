const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: "test user",
      email: "test_new@gmail.com",
      password: "password123",
      role: "student"
    });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.error("ERROR:", err.response ? err.response.data : err.message);
  }
}
test();
