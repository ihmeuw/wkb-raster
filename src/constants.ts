import {
  PixelType,
  RasterbandMetadataProperty,
  RasterMetadataProperty,
} from './types';

/**
 * Is this machine little-endian?
 */
export const LITTLE_ENDIAN = (function machineIsLittleEndian(): boolean {
  const uint8Array = new Uint8Array([0xAA, 0xBB]);
  const uint16array = new Uint16Array(uint8Array.buffer);
  return uint16array[0] === 0xBBAA;
})();

/**
 * lookup tables
 */

export const RASTER_METADATA_PROPERTIES: ReadonlyArray<RasterMetadataProperty> = [
  { name: 'endianness', byteOffset: 0,  byteLength: 1, type: 'Uint8' },
  { name: 'version',    byteOffset: 1,  byteLength: 2, type: 'Uint16' },
  { name: 'nBands',     byteOffset: 3,  byteLength: 2, type: 'Uint16' },
  { name: 'scaleX',     byteOffset: 5,  byteLength: 8, type: 'Float64' },
  { name: 'scaleY',     byteOffset: 13, byteLength: 8, type: 'Float64' },
  { name: 'ipX',        byteOffset: 21, byteLength: 8, type: 'Float64' },
  { name: 'ipY',        byteOffset: 29, byteLength: 8, type: 'Float64' },
  { name: 'skewX',      byteOffset: 37, byteLength: 8, type: 'Float64' },
  { name: 'skewY',      byteOffset: 45, byteLength: 8, type: 'Float64' },
  { name: 'srid',       byteOffset: 53, byteLength: 4, type: 'Int32' },
  { name: 'width',      byteOffset: 57, byteLength: 2, type: 'Uint16' },
  { name: 'height',     byteOffset: 59, byteLength: 2, type: 'Uint16' },
];

export const RASTERBAND_METADATA_PROPERTIES: ReadonlyArray<RasterbandMetadataProperty> = [
  { name: 'isOffline',      bitOffset: 0, bitLength: 1 },
  { name: 'hasNodataValue', bitOffset: 1, bitLength: 1 },
  { name: 'isNodataValue',  bitOffset: 2, bitLength: 1 },
  // { name: 'reserved',       bitOffset: 3, bitLength: 1 },
];

export const RASTERBAND_0_BYTE_OFFSET = 61;

export const PIXEL_TYPES: ReadonlyArray<PixelType> = [
  { type: 'Bool1',   byteLength: 1, id: 0 },
  { type: 'Uint2',   byteLength: 1, id: 1 },
  { type: 'Uint4',   byteLength: 1, id: 2 },
  { type: 'Int8',    byteLength: 1, id: 3 },
  { type: 'Uint8',   byteLength: 1, id: 4 },
  { type: 'Int16',   byteLength: 2, id: 5 },
  { type: 'Uint16',  byteLength: 2, id: 6 },
  { type: 'Int32',   byteLength: 4, id: 7 },
  { type: 'Uint32',  byteLength: 4, id: 8 },
  { type: 'Float32', byteLength: 4, id: 10 },
  { type: 'Float64', byteLength: 8, id: 11 },
];
