const http2 = {
  constants: {
    HTTP2_HEADER_CONTENT_ENCODING: 'content-encoding',
    HTTP2_HEADER_ACCEPT_ENCODING: 'accept-encoding',
    HTTP2_HEADER_PATH: ':path',
    HTTP2_HEADER_METHOD: ':method',
    HTTP2_HEADER_AUTHORITY: ':authority',
    HTTP2_HEADER_HOST: 'host',
    HTTP2_HEADER_STATUS: ':status',
    // Agregamos más constantes necesarias
    NGHTTP2_CANCEL: 0x8,
    NGHTTP2_REFUSED_STREAM: 0x7,
    NGHTTP2_DEFAULT_WEIGHT: 16,
    NGHTTP2_FLAG_NONE: 0x0,
    NGHTTP2_FLAG_END_STREAM: 0x1,
    NGHTTP2_FLAG_END_HEADERS: 0x4,
    NGHTTP2_FLAG_ACK: 0x1,
    NGHTTP2_FLAG_PADDED: 0x8,
    NGHTTP2_FLAG_PRIORITY: 0x20
  }
};

if (typeof window !== 'undefined') {
  window.http2 = http2;
}

module.exports = http2;