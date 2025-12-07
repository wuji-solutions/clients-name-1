const fs = require('fs');
const path = require('path');
const os = require('os');

const platform = os.platform();
const isDev = process.env.NODE_ENV !== 'production';

const backendBuildDir = path.resolve(__dirname, '../../backend/build/libs')

const backendBinDir = path.resolve(__dirname);

let binaryName;

binaryName = 'backend.jar';


const sourceBinary = path.join(backendBuildDir, binaryName);
const destBinary = path.join(backendBinDir, binaryName);

if (!fs.existsSync(sourceBinary)) {
  console.error(`Backend binary not found at ${sourceBinary}`);
  process.exit(1);
}

// Ensure destination dir exists
if (!fs.existsSync(backendBinDir)) {
  fs.mkdirSync(backendBinDir, { recursive: true });
}

fs.copyFileSync(sourceBinary, destBinary);
console.log(`Copied backend binary to ${destBinary}`);
