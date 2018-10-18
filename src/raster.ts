// WKB RASTER spec: https://github.com/postgis/postgis/blob/svn-trunk/raster/doc/RFC2-WellKnownBinaryFormat

import {
  RASTER_METADATA_PROPERTIES,
  RASTERBAND_0_BYTE_OFFSET,
} from './constants';
import parseRasterband from './rasterband';
import {
  Raster,
  Rasterband,
  RasterMetadataKey,
} from './types';
import {
  fromPairs,
  getDataViewValue,
} from './util';

/**
 * the main export: a function that creates a representation of the raster data
 */
export default function parse(arrayBuffer: ArrayBuffer): Raster {
  const dataView = new DataView(arrayBuffer);
  // Parse the metadata and create an object mapping metadata properties to their values.
  const metadata = fromPairs(
    RASTER_METADATA_PROPERTIES.map(({ name, byteOffset, type }) => [
      name,
      getDataViewValue(dataView, type, byteOffset),
    ] as [RasterMetadataKey, number],
  ));
  const bands = [] as Rasterband[];
  let bytePointer = RASTERBAND_0_BYTE_OFFSET;
  // Parse each raster band and create an array of the results.
  for (let i = 0; i < metadata.nBands; ++i) {
    const band = parseRasterband(metadata, dataView, bytePointer);
    bands.push(band);
    bytePointer += band.metadata.byteLength;
  }
  return {
    metadata,
    bands,
  };
}
