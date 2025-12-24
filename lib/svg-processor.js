class SVGProcessor {
  /**
   * Extract attribute value from SVG string using simple string operations
   * @param {string} svgContent - SVG content as string
   * @param {string} attributeName - Name of the attribute to extract
   * @returns {string|null} - Attribute value or null if not found
   */
  _getAttribute(svgContent, attributeName) {
    const svgStart = svgContent.indexOf('<svg');
    const svgEnd = svgContent.indexOf('>', svgStart) + 1;
    const svgTag = svgContent.substring(svgStart, svgEnd);
    
    const attrStart = svgTag.indexOf(attributeName + '=');
    if (attrStart === -1) {
      return null;
    }
    
    const quoteStart = svgTag.indexOf('"', attrStart) + 1;
    const quoteEnd = svgTag.indexOf('"', quoteStart);
    
    if (quoteStart === 0 || quoteEnd === -1) {
      // Try with single quotes
      const singleQuoteStart = svgTag.indexOf("'", attrStart) + 1;
      const singleQuoteEnd = svgTag.indexOf("'", singleQuoteStart);
      
      if (singleQuoteStart === 0 || singleQuoteEnd === -1) {
        return null;
      }
      return svgTag.substring(singleQuoteStart, singleQuoteEnd);
    }
    
    return svgTag.substring(quoteStart, quoteEnd);
  }

  /**
   * Set attribute value in SVG string using simple string operations
   * @param {string} svgContent - SVG content as string
   * @param {string} attributeName - Name of the attribute to set
   * @param {string} value - Value to set
   * @returns {string} - SVG content with updated attribute
   */
  _setAttribute(svgContent, attributeName, value) {
    const escapedValue = value.toString();
    const svgStart = svgContent.indexOf('<svg');
    const svgEnd = svgContent.indexOf('>', svgStart);
    
    if (svgStart === -1 || svgEnd === -1) {
      return svgContent;
    }
    
    const svgTag = svgContent.substring(svgStart, svgEnd + 1);
    const attrPattern = attributeName + '=';
    
    if (svgTag.includes(attrPattern)) {
      // Attribute exists, replace it
      const attrStart = svgTag.indexOf(attrPattern);
      const quoteStart = svgTag.indexOf('"', attrStart) + 1;
      const quoteEnd = svgTag.indexOf('"', quoteStart);
      
      if (quoteStart > 0 && quoteEnd > quoteStart) {
        const newSvgTag = svgTag.substring(0, quoteStart) + escapedValue + svgTag.substring(quoteEnd);
        return svgContent.substring(0, svgStart) + newSvgTag + svgContent.substring(svgEnd + 1);
      } else {
        // Try with single quotes
        const singleQuoteStart = svgTag.indexOf("'", attrStart) + 1;
        const singleQuoteEnd = svgTag.indexOf("'", singleQuoteStart);
        
        if (singleQuoteStart > 0 && singleQuoteEnd > singleQuoteStart) {
          const newSvgTag = svgTag.substring(0, singleQuoteStart) + escapedValue + svgTag.substring(singleQuoteEnd);
          return svgContent.substring(0, svgStart) + newSvgTag + svgContent.substring(svgEnd + 1);
        }
      }
    }
    
    // Attribute doesn't exist, add it after <svg
    const newSvgTag = '<svg ' + attributeName + '="' + escapedValue + '"' + svgTag.substring(4);
    return svgContent.substring(0, svgStart) + newSvgTag + svgContent.substring(svgEnd + 1);
  }

  /**
   * Process SVG content for conversion
   * @param {string} svgContent - SVG content as string
   * @param {Object} options - Processing options
   * @param {number} options.width - Target width
   * @param {number} options.height - Target height
   * @returns {string} - Processed SVG content
   */
  process(svgContent, options = {}) {
    // Get original dimensions
    let originalWidth = parseFloat(this._getAttribute(svgContent, 'width') || '0');
    let originalHeight = parseFloat(this._getAttribute(svgContent, 'height') || '0');
    const viewBox = this._getAttribute(svgContent, 'viewBox');

    if (viewBox) {
      const viewBoxParts = viewBox.split(/\s+/).map(Number);
      if (viewBoxParts.length === 4) {
        originalWidth = viewBoxParts[2];
        originalHeight = viewBoxParts[3];
      }
    }

    // Set default dimensions if not found
    if (!originalWidth || !originalHeight) {
      originalWidth = 100;
      originalHeight = 100;
    }

    // Calculate new dimensions if provided
    let { width = originalWidth, height = originalHeight } = options;

    if (width && !height) {
      height = (width / originalWidth) * originalHeight;
    } else if (height && !width) {
      width = (height / originalHeight) * originalWidth;
    }

    // Update SVG attributes
    let processedSvg = this._setAttribute(svgContent, 'width', width.toString());
    processedSvg = this._setAttribute(processedSvg, 'height', height.toString());
    processedSvg = this._setAttribute(processedSvg, 'viewBox', `0 0 ${originalWidth} ${originalHeight}`);

    // Ensure xmlns attribute is present
    if (!this._getAttribute(processedSvg, 'xmlns')) {
      processedSvg = this._setAttribute(processedSvg, 'xmlns', 'http://www.w3.org/2000/svg');
    }

    return processedSvg;
  }

  /**
   * Extract dimensions from SVG content
   * @param {string} svgContent - SVG content as string
   * @returns {Object} - Width and height
   */
  getDimensions(svgContent) {
    let width = parseFloat(this._getAttribute(svgContent, 'width') || '0');
    let height = parseFloat(this._getAttribute(svgContent, 'height') || '0');
    const viewBox = this._getAttribute(svgContent, 'viewBox');

    if (viewBox) {
      const viewBoxParts = viewBox.split(/\s+/).map(Number);
      if (viewBoxParts.length === 4) {
        width = viewBoxParts[2];
        height = viewBoxParts[3];
      }
    }

    return { width, height };
  }
}

export default SVGProcessor;
