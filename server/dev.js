const { spawn } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const commands = [
  {
    name: 'API',
    args: [path.join(__dirname, 'index.js')],
  },
  {
    name: 'React',
    args: [path.join(projectRoot, 'node_modules', 'react-scripts', 'scripts', 'start.js')],
    env: { BROWSER: 'none' },
  },
];

const children = [];
let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
}

for (const command of commands) {
  const child = spawn(process.execPath, command.args, {
    cwd: projectRoot,
    env: { ...process.env, ...command.env },
    stdio: 'inherit',
  });
  children.push(child);
  child.on('error', (error) => {
    console.error(`${command.name} process failed:`, error.message);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) {
      console.error(`${command.name} server stopped${signal ? ` (${signal})` : ''}.`);
      stop(code || 1);
    }
  });
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
