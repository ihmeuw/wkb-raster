import {
  PIXEL_TYPES,
  RASTERBAND_METADATA_PROPERTIES,
} from './constants';
import {
  PixelType,
  Rasterband,
  RasterbandMetadata,
  RasterbandMetadataKey,
  RasterMetadata,
} from './types';
import {
  fromPairs,
  getDataViewValue,
  getTypedArrayConstructor,
} from './util';

/**
 * returns a representation of a raster band
 */
export default function parseRasterband(
  rasterMetadata: RasterMetadata,
  dataView: DataView,
  byteOffset: number,
): Rasterband {
  // The first byte contains all metadata except the nodata value.
  const firstByte = dataView.getUint8(byteOffset);
  // pixtype is packed into the latter 4 bits. We use a bit mask to extract it.
  const pixtype = firstByte & 0b00001111;
  // pixtype is an integer ID representing the pixel type. To get more useful information, we find
  // the corresponding entry in the lookup table PIXEL_TYPES.
  const pixelType = PIXEL_TYPES.find(({ id }) => id === pixtype) as PixelType;
  const pixelByteLength = pixelType.byteLength;
  // length of the pixel data in bytes
  const dataLength = rasterMetadata.width * rasterMetadata.height * pixelByteLength;
  // length of the entire raster band in bytes (including the metadata byte and the nodata value)
  const byteLength = 1 + pixelByteLength + dataLength;
  // Parse the band metadata and create an object mapping metadata properties to their values.
  const metadataProperties = fromPairs(
    RASTERBAND_METADATA_PROPERTIES.map(({ name, bitOffset }) => [
      // key: metadata property name
      name,
      // value: represented as boolean
      // To get the correct bit, we right-shift a bit mask by the bit offset.
      Boolean(firstByte & (0b1000000 >> bitOffset)),
    ] as [RasterbandMetadataKey, boolean],
  ));
  // The final metadata object contains the metadata properties extracted from the binary representation
  // as well as some useful computed properties, like the string representation of the pixel type and
  // the length of the entire raster band in bytes.
  const metadata: RasterbandMetadata = {
    ...metadataProperties,
    byteLength,
    pixtype,
    pixelType: pixelType.type,
    // If the band has a nodata value, get it.
    nodata: (
      metadataProperties.hasNodataValue
      ? getDataViewValue(dataView, pixelType.type, byteOffset + 1)
      : undefined
    ),
  };

  // Get the TypedArray constructor appropriate for the pixel type.
  const dataArrayConstructor = getTypedArrayConstructor(pixelType.type);

  return {
    metadata,
    // Create a TypedArray of the appropriate type to represent the pixel data.
    data: new dataArrayConstructor(dataView.buffer.slice(
      byteOffset + 1 + pixelByteLength,
      byteOffset + byteLength,
    )),
  };
}
