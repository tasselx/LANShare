import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the backend server
const server = spawn('node', ['../server.js'], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname)
});

// Start the frontend development server
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname)
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  server.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

console.log('LANShare servers started!');
console.log('Press Ctrl+C to stop all servers.');
