import fs from 'node:fs';
import SVGProcessor from './lib/svg-processor.js';
import PNGConverter from './lib/png-converter.js';
import ICOConverter from './lib/ico-converter.js';
import ICNSConverter from './lib/icns-converter.js';

class SVGConverter {
  constructor() {
    this.svgProcessor = new SVGProcessor();
    this.pngConverter = new PNGConverter();
    this.icoConverter = new ICOConverter();
    this.icnsConverter = new ICNSConverter();
  }

  /**
   * Convert SVG file to PNG format
   * @param {string} inputPath - Path to input SVG file
   * @param {string} outputPath - Path to output PNG file
   * @param {Object} options - Conversion options
   * @param {number} options.width - Output width in pixels
   * @param {number} options.height - Output height in pixels
   * @returns {Promise<void>}
   */
  async toPng(inputPath, outputPath, options = {}) {
    const svgContent = fs.readFileSync(inputPath, 'utf8');
    const processedSvg = this.svgProcessor.process(svgContent, options);
    await this.pngConverter.convert(processedSvg, outputPath, options);
  }

  /**
   * Convert SVG file to ICO format
   * @param {string} inputPath - Path to input SVG file
   * @param {string} outputPath - Path to output ICO file
   * @param {Object} options - Conversion options
   * @param {number[]} options.sizes - Array of sizes to include in ICO file
   * @returns {Promise<void>}
   */
  async toIco(inputPath, outputPath, options = {}) {
    const svgContent = fs.readFileSync(inputPath, 'utf8');
    await this.icoConverter.convert(svgContent, outputPath, options);
  }

  /**
   * Convert SVG file to ICNS format
   * @param {string} inputPath - Path to input SVG file
   * @param {string} outputPath - Path to output ICNS file
   * @param {Object} options - Conversion options
   * @param {number[]} options.sizes - Array of sizes to include in ICNS file
   * @returns {Promise<void>}
   */
  async toIcns(inputPath, outputPath, options = {}) {
    const svgContent = fs.readFileSync(inputPath, 'utf8');
    await this.icnsConverter.convert(svgContent, outputPath, options);
  }
}

export default SVGConverter;
