const fs = require('fs');
const sharp = require('sharp');

class PNGConverter {
  /**
   * Convert SVG to PNG using sharp library
   * @param {string} svgContent - SVG content
   * @param {string} outputPath - Output file path
   * @param {Object} options - Conversion options
   * @returns {Promise<void>}
   */
  async convert(svgContent, outputPath, options = {}) {
    const { width = 100, height = 100 } = options;
    
    // Convert SVG string to Buffer
    const svgBuffer = Buffer.from(svgContent);
    
    // Use sharp to convert SVG to PNG
    await sharp(svgBuffer)
      .resize(width, height)
      .png()
      .toFile(outputPath);
  }
}

module.exports = PNGConverter;