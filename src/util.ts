import { LITTLE_ENDIAN } from './constants';
import {
  DataViewGetter,
  PixelTypePrimitive,
  TypedArrayConstructor,
} from './types';

export type Dictionary<K extends string, V> = {
  [T in K]: V;
};

export function fromPairs<K extends string, T>(array: Array<[K, T]>): Dictionary<K, T> {
  const output = Object.create(null) as Dictionary<K, T>;
  for (const [key, value] of array) {
    output[key] = value;
  }
  return output;
}

/**
 * gets the appropriate TypedArray constructor to represent the pixel type
 */
export function getTypedArrayConstructor(pixelType: PixelTypePrimitive): TypedArrayConstructor {
  switch (pixelType) {
    case 'Bool1':
    case 'Uint2':
    case 'Uint4':
    case 'Uint8': return Uint8Array;
    case 'Int8': return Int8Array;
    case 'Uint16': return Uint16Array;
    case 'Int16': return Int16Array;
    case 'Uint32': return Uint32Array;
    case 'Int32': return Int32Array;
    case 'Float32': return Float32Array;
    case 'Float64': return Float64Array;
    default: throw new Error(`Unrecognized pixel type: ${pixelType}`);
  }
}

/**
 * gets a value of the specified type at a given byte offset in a DataView
 * for pixel types smaller than a byte, we just use `getUint8`
 */
export function getDataViewValue(dataView: DataView, type: PixelTypePrimitive, byteOffset: number): number {
  const dataViewGetter = (dataView[`get${type}` as keyof DataView] || dataView.getUint8) as DataViewGetter;
  return dataViewGetter(byteOffset, LITTLE_ENDIAN);
}
