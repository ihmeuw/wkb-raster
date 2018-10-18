/**
 * parsed WKB raster
 */
export interface Raster {
  metadata: RasterMetadata;
  bands: Rasterband[];
}

/**
 * raster metadata
 */

export interface RasterMetadata {
  endianness: number;
  version: number;
  nBands: number;
  scaleX: number;
  scaleY: number;
  ipX: number;
  ipY: number;
  skewX: number;
  skewY: number;
  srid: number;
  width: number;
  height: number;
}

export interface RasterMetadataProperty {
  name: RasterMetadataKey;
  byteOffset: number;
  byteLength: number;
  type: NumberType;
}

export type RasterMetadataKey =
  | 'endianness'
  | 'version'
  | 'nBands'
  | 'scaleX'
  | 'scaleY'
  | 'ipX'
  | 'ipY'
  | 'skewX'
  | 'skewY'
  | 'srid'
  | 'width'
  | 'height'
  ;

export type NumberType =
  | 'Uint8'
  | 'Uint16'
  | 'Int32'
  | 'Float64'
  ;

/**
 * parsed rasterband
 */
export interface Rasterband {
  metadata: RasterbandMetadata;
  data: TypedArray;
}

/**
 * rasterband metadata
 */

export interface RasterbandMetadataIntrinsic {
  isOffline: boolean;
  hasNodataValue: boolean;
  isNodataValue: boolean;
}

export interface RasterbandMetadata extends RasterbandMetadataIntrinsic {
  byteLength: number;
  pixtype: number;
  pixelType: PixelTypePrimitive;
  nodata?: number;
}

export interface RasterbandMetadataProperty {
  name: RasterbandMetadataKey;
  bitOffset: number;
  bitLength: number;
}

export type RasterbandMetadataKey =
  | 'isOffline'
  | 'hasNodataValue'
  | 'isNodataValue'
  ;

export interface PixelType {
  type: PixelTypePrimitive;
  byteLength: number;
  id: number;
}

export type PixelTypePrimitive =
  | 'Bool1'
  | 'Uint2'
  | 'Uint4'
  | 'Int8'
  | 'Uint8'
  | 'Int16'
  | 'Uint16'
  | 'Int32'
  | 'Uint32'
  | 'Float32'
  | 'Float64'
  ;

/**
 * helper types for JavaScript builtins
 */

export type TypedArray =
| Uint8Array
| Uint16Array
| Uint32Array
| Int8Array
| Int16Array
| Int32Array
| Float32Array
| Float64Array
;

export type TypedArrayConstructor =
| Uint8ArrayConstructor
| Uint16ArrayConstructor
| Uint32ArrayConstructor
| Int8ArrayConstructor
| Int16ArrayConstructor
| Int32ArrayConstructor
| Float32ArrayConstructor
| Float64ArrayConstructor
;

export type DataViewGetter = (byteOffset: number, littleEndian?: boolean) => number;
