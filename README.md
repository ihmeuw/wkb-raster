# wkb-raster
## JavaScript parser for the Well-Known Binary (WKB) RASTER type used in PostGIS

This small library ("Look, Ma, no runtime dependencies!") allows one to parse the [binary format](https://github.com/postgis/postgis/blob/svn-trunk/raster/doc/RFC2-WellKnownBinaryFormat) returned by the PostGIS raster function `ST_AsBinary`. According to the spec:

> The WKB format for RASTER is meant for transport.
Takes into account endiannes and avoids any padding.
Still, beside padding and endiannes, it matches the
internal serialized format (see RFC1), for quick
input/output.

The parsed object contains metadata about the raster plus one or more raster bands (each with their own metadata). The pixel data itself constitutes the `data` property of a band. It's represented as a JavaScript TypedArray.

## Installation
```bash
$ npm install wkb-raster
```

## Example Usage
```javascript
import parseRaster from 'wkb-raster';
import { Pool } from 'pg'

// Make a connection pool to query PostGIS.
const pool = new Pool();

async function getAndParseRaster() {
  // Retrieve some WKB RASTER data.
  const sql = 'SELECT ST_AsBinary(rast) AS rast FROM my_raster_table LIMIT 1';
  const { rows } = await pool.query(sql);

  // Retrieve the Node Buffer containing the WKB representation of the raster.
  const buffer = rows[0].rast;
  // It's likely Node used a giant Buffer with lots of other things in it to store our data,
  // so we make a copy of just the portion we need.
  const rawWKB = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  // Parse the raster as a JavaScript object.
  const raster = parseRaster(rawWKB);

  // Here's what it contains.
  const {
    metadata: {
      // all these properties represent numbers
      endianness, // 1: little-endian ; 2: big-endian
      version,    // format version
      nBands,     // number of bands
      scaleX,     // pixel width (in geographical units)
      scaleY,     // pixel height (in geographical units)
      ipX,        // X value of upper-left corner (in geographical units)
      ipY,        // Y value of upper-left corner (in geographical units)
      skewX,      // rotation about the Y-axis
      skewY,      // rotation about the X-axis
      srid,       // spatial reference ID
      width,      // number of pixel columns
      height,     // number of pixel rows
    },
    // destructuring just the first band
    bands: [{
      metadata: {
        // boolean properties
        isOffline,
        hasNodataValue,
        isNodataValue,
        // number of bytes in the band's `data` property
        byteLength,
        // represents the pixel type using a numeric ID (see the spec)
        pixtype,
        // More useful representation of the pixel type. One of:
        //   'Bool1', 'Uint2', 'Uint4', 'Int8', 'Uint8',
        //   'Int16', 'Uint16', 'Int32', 'Uint32', 'Float32', 'Float64'
        pixelType,
        // the nodata value, if defined
        nodata,
      },
      // Typed Array containing pixel data (type depends on the pixel type of the raster)
      data,
    }],
  } = raster;

  // ... Then do something wonderful with the raster!
}
```

## Unimplemented

At present, filesystem (out-db) rasters are not supported. I'd like to include support for this, but I don't currently have a use for it, so my motivation to do so is low. PRs are welcome, however!
