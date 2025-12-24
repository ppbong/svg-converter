// CommonJS 兼容层
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = require('node:path').dirname(__filename);

console.log('__filename:', __filename);
console.log('__dirname:', __dirname);

// 导入 ES 模块版本并重新导出
import SVGConverter from './index.js';

module.exports = SVGConverter;
