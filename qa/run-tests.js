const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cwd = __dirname;
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const newmanArgs = [
  'newman',
  'run',
  'collections/FakeStoreAPI.postman_collection.json',
  '-e',
  'environments/FakeStore-Dev.postman_environment.json',
  '-r',
  'cli,htmlextra,json',
  '--reporter-json-export',
  'reports/report.json',
  '--reporter-htmlextra-export',
  'reports/report.html',
  '--reporter-htmlextra-title',
  'Fake Store API Test Report',
];

const newman = spawnSync(npxCmd, newmanArgs, {
  cwd,
  stdio: 'inherit',
  shell: false,
});

if (newman.status !== 0) {
  process.exit(newman.status ?? 1);
}

const reportPath = path.join(cwd, 'reports', 'report.html');
if (fs.existsSync(reportPath)) {
  const date = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(reportPath, path.join(cwd, 'reports', `report-${date}.html`));
}

const report = spawnSync(npmCmd, ['run', 'report'], {
  cwd,
  stdio: 'inherit',
  shell: false,
});

process.exit(report.status ?? 1);
