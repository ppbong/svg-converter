# svg-converter

SVG to PNG, ICO, ICNS converter library for Node.js

## Installation

```bash
npm install @ppbong/svg-converter
```

## Usage

### ES Modules (import)

```javascript
import SVGConverter from '@ppbong/svg-converter';

const converter = new SVGConverter();

// Convert to PNG
await converter.toPng('input.svg', 'output.png', { width: 200, height: 200 });

// Convert to ICO
await converter.toIco('input.svg', 'output.ico', { sizes: [16, 32, 64] });

// Convert to ICNS
await converter.toIcns('input.svg', 'output.icns', { sizes: [16, 32, 64] });
```

### CommonJS (require)

```javascript
const SVGConverter = require('@ppbong/svg-converter');

const converter = new SVGConverter();

// Convert to PNG
converter.toPng('input.svg', 'output.png', { width: 200, height: 200 });

// Convert to ICO
converter.toIco('input.svg', 'output.ico', { sizes: [16, 32, 64] });

// Convert to ICNS
converter.toIcns('input.svg', 'output.icns', { sizes: [16, 32, 64] });
```

## API

### toPng(inputPath, outputPath, options)
- `inputPath`: 输入SVG文件路径
- `outputPath`: 输出PNG文件路径
- `options`: 
  - `width`: 输出宽度
  - `height`: 输出高度

### toIco(inputPath, outputPath, options)
- `inputPath`: 输入SVG文件路径
- `outputPath`: 输出ICO文件路径
- `options`: 
  - `sizes`: 包含的尺寸数组

### toIcns(inputPath, outputPath, options)
- `inputPath`: 输入SVG文件路径
- `outputPath`: 输出ICNS文件路径
- `options`: 
  - `sizes`: 包含的尺寸数组
  - `includeRetina`: 是否包含Retina分辨率图标

## License

MIT