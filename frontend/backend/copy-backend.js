const fs = require('fs');
const path = require('path');
const os = require('os');

const platform = os.platform();
const isDev = process.env.NODE_ENV !== 'production';

const backendBuildDir = isDev
  ? path.resolve(__dirname, '../../backend/build/libs')
  : path.resolve(__dirname, '../../backend/build/native/nativeCompile');

const backendBinDir = path.resolve(__dirname);

let binaryName;
if (isDev) {
  binaryName = 'backend.jar';
} else {
  binaryName = platform === 'win32' ? 'backend.exe' : 'backend';
}

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
