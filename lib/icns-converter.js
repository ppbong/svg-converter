const fs = require('fs');
const PNGConverter = require('./png-converter');

class ICNSConverter {
  constructor() {
    this.pngConverter = new PNGConverter();
    // Mapping of size to ICNS icon type
    this.iconTypes = {
      16: { '@1x': 'ic04', '@2x': 'ic11' },
      32: { '@1x': 'ic05', '@2x': 'ic12' },
      64: { '@1x': 'ic07', '@2x': 'ic13' },
      128: { '@1x': 'ic08', '@2x': 'ic14' },
      256: { '@1x': 'ic09', '@2x': 'ic15' },
      512: { '@1x': 'ic10', '@2x': 'ic16' }
    };
  }

  /**
   * Create ICNS file header
   * @param {number} fileSize - Total file size
   * @returns {Buffer} - ICNS file header buffer
   */
  _createFileHeader(fileSize) {
    const header = Buffer.alloc(8);
    header.write('icns', 0); // Magic number
    header.writeUInt32BE(fileSize, 4); // File size
    return header;
  }

  /**
   * Create ICNS icon data block
   * @param {string} type - Icon type (4 bytes)
   * @param {Buffer} data - Icon data
   * @returns {Buffer} - Icon data block buffer
   */
  _createIconBlock(type, data) {
    const blockSize = 8 + data.length; // 8 bytes for header, plus data
    const block = Buffer.alloc(blockSize);
    
    block.write(type, 0); // Icon type
    block.writeUInt32BE(blockSize, 4); // Block size
    data.copy(block, 8); // Icon data
    
    return block;
  }

  /**
   * Convert SVG to ICNS
   * @param {string} svgContent - SVG content
   * @param {string} outputPath - Output file path
   * @param {Object} options - Conversion options
   * @param {number[]} options.sizes - Array of sizes to include in ICNS file
   * @returns {Promise<void>}
   */
  async convert(svgContent, outputPath, options = {}) {
    const sizes = options.sizes || [16, 32, 64, 128, 256, 512];
    const includeRetina = options.includeRetina !== false; // Default to true
    const iconBlocks = [];
    
    // Generate icon data for each size and resolution
    for (const size of sizes) {
      if (this.iconTypes[size]) {
        // Regular resolution (@1x)
        const pngBuffer1x = await this._generatePNGBuffer(svgContent, { width: size, height: size });
        const block1x = this._createIconBlock(this.iconTypes[size]['@1x'], pngBuffer1x);
        iconBlocks.push(block1x);
        
        // Retina resolution (@2x) if supported
        if (includeRetina && this.iconTypes[size]['@2x']) {
          const retinaSize = size * 2;
          const pngBuffer2x = await this._generatePNGBuffer(svgContent, { width: retinaSize, height: retinaSize });
          const block2x = this._createIconBlock(this.iconTypes[size]['@2x'], pngBuffer2x);
          iconBlocks.push(block2x);
        }
      }
    }
    
    // Calculate total file size
    const totalSize = 8 + iconBlocks.reduce((sum, block) => sum + block.length, 0);
    
    // Create file header
    const fileHeader = this._createFileHeader(totalSize);
    
    // Combine all parts
    const icnsBuffer = Buffer.concat([fileHeader, ...iconBlocks]);
    
    // Write to file
    fs.writeFileSync(outputPath, icnsBuffer);
  }

  /**
   * Generate PNG buffer from SVG content
   * @param {string} svgContent - SVG content
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - PNG buffer
   */
  async _generatePNGBuffer(svgContent, options) {
    // Use PNGConverter to create PNG data in memory
    const pngConverter = new PNGConverter();
    const tempPath = `temp_${Date.now()}.png`;
    await pngConverter.convert(svgContent, tempPath, options);
    const buffer = fs.readFileSync(tempPath);
    fs.unlinkSync(tempPath);
    
    return buffer;
  }
}

module.exports = ICNSConverter;
