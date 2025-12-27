// Type definitions for @ppbong/svg-converter
// Project: https://github.com/ppbong/svg-converter
// Definitions by: ppbong
// Definitions: https://github.com/ppbong/svg-converter

declare class SVGConverter {
  constructor();

  /**
   * Convert SVG file to PNG format
   * @param inputPath - Path to input SVG file
   * @param outputPath - Path to output PNG file
   * @param options - Conversion options
   * @returns Promise<void>
   */
  toPng(inputPath: string, outputPath: string, options?: PNGOptions): Promise<void>;

  /**
   * Convert SVG file to ICO format
   * @param inputPath - Path to input SVG file
   * @param outputPath - Path to output ICO file
   * @param options - Conversion options
   * @returns Promise<void>
   */
  toIco(inputPath: string, outputPath: string, options?: ICOOptions): Promise<void>;

  /**
   * Convert SVG file to ICNS format
   * @param inputPath - Path to input SVG file
   * @param outputPath - Path to output ICNS file
   * @param options - Conversion options
   * @returns Promise<void>
   */
  toIcns(inputPath: string, outputPath: string, options?: ICNSOptions): Promise<void>;
}

interface PNGOptions {
  /**
   * Output width in pixels
   * @default 100
   */
  width?: number;

  /**
   * Output height in pixels
   * @default 100
   */
  height?: number;
}

interface ICOOptions {
  /**
   * Array of sizes to include in ICO file
   * @default [16, 24, 32, 48, 64, 128, 256]
   */
  sizes?: number[];
}

interface ICNSOptions {
  /**
   * Array of sizes to include in ICNS file
   * @default [16, 32, 64, 128, 256, 512]
   */
  sizes?: number[];

  /**
   * Whether to include retina (@2x) versions of each size
   * @default true
   */
  includeRetina?: boolean;
}

// export default SVGConverter;

declare module '@ppbong/svg-converter' {
  export default SVGConverter;
}