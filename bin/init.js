#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const cwd = process.cwd();
const publicDir = path.join(cwd, "public");
const dest = path.join(publicDir, "worker.js");

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const src = path.join(__dirname, "../src/worker.js");

console.log("\n🛠  Setting up service worker for push-notifier...\n");

// 1. Check if 'public' directory exists, if not, create it
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
  console.log(`📁 Created ./public directory`);
}

// 2. Copy the service worker file
fs.copyFileSync(src, dest);
console.log(`✅ Copied service worker to: ./public/worker.js`);

// 3. Check if push-notifier is installed
const isInstalled = fs.existsSync(
  path.join(cwd, "node_modules", "push-notifier")
);

if (!isInstalled) {
  console.warn(
    `\n⚠️  Looks like 'push-notifier' isn't installed as a dependency.\n` +
      `   To use the push logic in your frontend code, run:\n\n` +
      `   👉 npm install push-notifier\n`
  );
} else {
  console.log(`📦 Detected 'push-notifier' is installed.`);
}

// 4. Final message
console.log(
  `\n🚀 All done! Now you can import and use 'initPushNotifications()' in your frontend.\n`
);
