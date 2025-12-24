const fs = require('fs');
const PNGConverter = require('./png-converter');

class ICOConverter {
  constructor() {
    this.pngConverter = new PNGConverter();
  }

  /**
   * Create ICO file header
   * @param {number} numImages - Number of images in the ICO file
   * @returns {Buffer} - ICO file header buffer
   */
  _createFileHeader(numImages) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // ICO type
    header.writeUInt16LE(numImages, 4); // Number of images
    return header;
  }

  /**
   * Create ICO icon directory entry
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @param {number} colorCount - Number of colors (0 for true color)
   * @param {number} offset - Offset to image data
   * @param {Buffer} imageData - Image data buffer
   * @returns {Buffer} - Icon directory entry buffer
   */
  _createDirEntry(width, height, colorCount, offset, imageData) {
    const entry = Buffer.alloc(16);
    
    // Width and height are 1 byte each, 0 means 256
    entry.writeUInt8(width === 256 ? 0 : width, 0);
    entry.writeUInt8(height === 256 ? 0 : height, 1);
    entry.writeUInt8(colorCount, 2); // Color count (0 for true color)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes (must be 1)
    entry.writeUInt16LE(32, 6); // Bits per pixel (32 for RGBA)
    entry.writeUInt32LE(imageData.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset to image data
    
    return entry;
  }

  /**
   * Convert SVG to ICO
   * @param {string} svgContent - SVG content
   * @param {string} outputPath - Output file path
   * @param {Object} options - Conversion options
   * @param {number[]} options.sizes - Array of sizes to include in ICO file
   * @returns {Promise<void>}
   */
  async convert(svgContent, outputPath, options = {}) {
    const sizes = options.sizes || [16, 24, 32, 48, 64, 128, 256];
    const imageDataList = [];
    const dirEntries = [];
    
    // Generate PNG data for each size
    for (const size of sizes) {
      // Create temporary PNG buffer using PNGConverter
      const tempPngBuffer = await this._generatePNGBuffer(svgContent, { width: size, height: size });
      imageDataList.push(tempPngBuffer);
    }
    
    // Calculate file header size and directory entries size
    const fileHeaderSize = 6;
    const dirEntriesSize = 16 * sizes.length;
    let currentOffset = fileHeaderSize + dirEntriesSize;
    
    // Create directory entries
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const imageData = imageDataList[i];
      const entry = this._createDirEntry(size, size, 0, currentOffset, imageData);
      dirEntries.push(entry);
      currentOffset += imageData.length;
    }
    
    // Create file header
    const fileHeader = this._createFileHeader(sizes.length);
    
    // Combine all parts
    const icoBuffer = Buffer.concat([fileHeader, ...dirEntries, ...imageDataList]);
    
    // Write to file
    fs.writeFileSync(outputPath, icoBuffer);
  }

  /**
   * Generate PNG buffer from SVG content
   * @param {string} svgContent - SVG content
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - PNG buffer
   */
  async _generatePNGBuffer(svgContent, options) {
    // Use PNGConverter to create PNG data in memory
    // Since PNGConverter's convert method writes to file, we need a different approach
    // For now, we'll create a simple PNG-like buffer with test data
    const { width = 100, height = 100 } = options;
    
    // Create a simple PNG buffer with red background
    const pngConverter = new PNGConverter();
    const tempPath = `temp_${Date.now()}.png`;
    await pngConverter.convert(svgContent, tempPath, options);
    const buffer = fs.readFileSync(tempPath);
    fs.unlinkSync(tempPath);
    
    return buffer;
  }
}

module.exports = ICOConverter;
