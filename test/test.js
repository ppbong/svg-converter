const SVGConverter = require('../index');
const path = require('path');

async function runTests() {
  const converter = new SVGConverter();
  const inputPath = path.join(__dirname, 'test.svg');
  
  console.log('Starting SVG conversion tests...');
  
  try {
    // Test PNG conversion
    console.log('Converting to PNG...');
    const pngOutput = path.join(__dirname, 'output.png');
    await converter.toPng(inputPath, pngOutput, { width: 200, height: 200 });
    console.log(`PNG conversion successful: ${pngOutput}`);
    
    // Test ICO conversion
    console.log('Converting to ICO...');
    const icoOutput = path.join(__dirname, 'output.ico');
    await converter.toIco(inputPath, icoOutput, { sizes: [16, 32, 64] });
    console.log(`ICO conversion successful: ${icoOutput}`);
    
    // Test ICNS conversion
    console.log('Converting to ICNS...');
    const icnsOutput = path.join(__dirname, 'output.icns');
    await converter.toIcns(inputPath, icnsOutput, { sizes: [16, 32, 64] });
    console.log(`ICNS conversion successful: ${icnsOutput}`);
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

runTests();
