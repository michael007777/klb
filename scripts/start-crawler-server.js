const { spawn } = require('child_process');
const path = require('path');

console.log('启动快乐8爬虫代理服务器...');

const serverPath = path.join(__dirname, '../src/crawler/server.ts');

// 使用ts-node运行TypeScript服务器
const crawlerServer = spawn('npx', ['ts-node', serverPath], {
  stdio: 'inherit',
  shell: true
});

crawlerServer.on('error', (error) => {
  console.error('爬虫服务器启动失败:', error);
});

crawlerServer.on('close', (code) => {
  console.log(`爬虫服务器进程退出，代码: ${code}`);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('正在关闭爬虫服务器...');
  crawlerServer.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('正在关闭爬虫服务器...');
  crawlerServer.kill('SIGTERM');
});