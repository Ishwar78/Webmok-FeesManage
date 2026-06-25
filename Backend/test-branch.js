const axios = require('axios');

async function testBranchCreation() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'info@gmail.in',
      password: 'webmok@#12398'
    });
    const token = loginRes.data.token;
    console.log("Login success. Token obtained.");

    const branchRes = await axios.post('http://localhost:5000/api/admin/branches', {
      branchName: "Test Branch",
      branchCode: "TB01",
      city: "Test City",
      state: "Test State"
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Branch created:", branchRes.data);
  } catch (error) {
    console.error("Error occurred:", error.response ? error.response.data : error.message);
  }
}

testBranchCreation();
