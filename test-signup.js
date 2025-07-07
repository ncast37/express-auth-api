#!/usr/bin/env node

const axios = require('axios');

async function testSignup() {
  console.log('🧪 Testing signup endpoint...\n');
  
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123'
  };
  
  try {
    console.log('📤 Sending request to: http://localhost:3000/api/auth/signup');
    console.log('📦 Request data:', { 
      name: testUser.name, 
      email: testUser.email, 
      password: '[HIDDEN]' 
    });
    
    const response = await axios.post('http://localhost:3000/api/auth/signup', testUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Success!');
    console.log('📊 Status:', response.status);
    console.log('📋 Response:', response.data);
    
  } catch (error) {
    console.log('❌ Error occurred:');
    console.log('📊 Status:', error.response?.status);
    console.log('📄 Status Text:', error.response?.statusText);
    console.log('📋 Response Data:', error.response?.data);
    console.log('🔗 Request URL:', error.config?.url);
    console.log('📤 Request Headers:', error.config?.headers);
    
    if (error.code) {
      console.log('🚨 Error Code:', error.code);
    }
    
    if (error.message) {
      console.log('💬 Error Message:', error.message);
    }
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await axios.get('http://localhost:3000/health', { timeout: 5000 });
    console.log('🟢 Server is running');
    return true;
  } catch (error) {
    console.log('🔴 Server is not running. Please start the backend server first.');
    console.log('Run: npm run dev');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testSignup();
  }
}

main();
