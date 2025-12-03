process.env.APP_VERSION = process.env.APP_VERSION || '0.0.0-local';
require('child_process').execSync(`electron-builder --config.extraMetadata.version=${process.env.APP_VERSION}`, {stdio: 'inherit'});