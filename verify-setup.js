const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Modern Signup Form Project Setup...\n');

const requiredFiles = {
  'Backend Files': [
    'package.json',
    'server.js',
    'routes/auth.js',
    'controllers/authController.js',
    'models/User.js',
    'middleware/auth.js',
    'hooks/useAuth.js',
    'utils/api.js'
  ],
  'Frontend Files': [
    'client/package.json',
    'client/src/App.js',
    'client/src/App.css',
    'client/src/index.js',
    'client/src/index.css',
    'client/src/components/SignupForm.js',
    'client/src/components/LoginForm.js',
    'client/src/components/Dashboard.js',
    'client/src/hooks/useAuth.js',
    'client/src/utils/api.js',
    'client/public/index.html'
  ],
  'Documentation': [
    'PROJECT_README.md',
    'client/README.md'
  ],
  'Startup Scripts': [
    'start-app.bat',
    'start-app.sh'
  ]
};

let allFilesExist = true;
let totalFiles = 0;
let existingFiles = 0;

Object.entries(requiredFiles).forEach(([category, files]) => {
  console.log(`📂 ${category}:`);
  
  files.forEach(file => {
    totalFiles++;
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      existingFiles++;
      console.log(`  ✅ ${file}`);
    } else {
      allFilesExist = false;
      console.log(`  ❌ ${file} - MISSING`);
    }
  });
  
  console.log('');
});

console.log('📊 Summary:');
console.log(`  Files found: ${existingFiles}/${totalFiles}`);
console.log(`  Completion: ${Math.round((existingFiles/totalFiles) * 100)}%`);

if (allFilesExist) {
  console.log('\n🎉 All files are in place! The project is ready to run.');
  console.log('\n🚀 To start the application:');
  console.log('  Windows: ./start-app.bat');
  console.log('  macOS/Linux: ./start-app.sh');
  console.log('\n📖 Check PROJECT_README.md for detailed setup instructions.');
} else {
  console.log('\n⚠️  Some files are missing. Please check the setup.');
}

console.log('\n🔗 Key URLs (when running):');
console.log('  Frontend: http://localhost:3001');
console.log('  Backend API: http://localhost:3000');
console.log('  Health Check: http://localhost:3000/health');
