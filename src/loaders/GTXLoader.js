import 'mrdoob/three.js';
import 'mrdoob/three.js/loaders/DDSLoader.js';

// GTX is just a DDS with an encrypted header
const GTX_TO_DSS = [0xF6, 0xD2, 0x72, 0x29, 0xAF, 0xD1, 0x3D, 0xB2, 0x98, 0xC3, 0x9E, 0x23, 0xC6, 0xF9, 0x6F, 0x2B, 0x32, 0x57, 0x6B, 0x16, 0x0E, 0x2E, 0xE3, 0x25, 0xE8, 0x19, 0x47, 0x67, 0x7D, 0x8A, 0x65, 0x00, 0x18, 0xC8, 0xB9, 0x14, 0x6E, 0xCA, 0x20, 0x4C, 0xEC, 0x8F, 0x4A, 0xC5, 0xD7, 0x3A, 0xB8, 0xFC, 0xE9, 0xB7, 0x42, 0xFF, 0x78, 0x1E, 0x7F, 0x12, 0xB0, 0x36, 0xE6, 0x04, 0x4D, 0xF5, 0x01, 0x60, 0x40, 0x50, 0xDE, 0x09, 0x03, 0x95, 0x75, 0x0A, 0x2C, 0x54, 0xA7, 0xFA, 0x0C, 0xEA, 0x82, 0xD4, 0x7A, 0xE2, 0x11, 0x84, 0x4B, 0x46, 0x3B, 0xC7, 0xB3, 0x08, 0x7B, 0xBC, 0xF3, 0x71, 0x40, 0xF2, 0x10, 0x37, 0x3E, 0xAA, 0x64, 0x4F, 0x26, 0x7E, 0x66, 0xFB, 0x81, 0x8D, 0x58, 0x0B, 0xE4, 0xEB, 0x5E, 0x80, 0x5F, 0xA3, 0x02, 0x87, 0x8E, 0xD6, 0x89, 0xC9, 0x44, 0x2A, 0x55, 0x92, 0xCD, 0xBB, 0x06, 0x81, 0x5B, 0xF0, 0xF7, 0xD9, 0x49, 0x6C, 0xBE, 0x24, 0x0F, 0x45, 0xA8, 0xE7, 0xDA, 0x61, 0x8C, 0xB4, 0xD8, 0xBD, 0x05, 0x5C, 0x90, 0x4E, 0x33, 0x76, 0x1A, 0x53, 0x1D, 0x9D, 0xB1, 0x70, 0x1F, 0x88, 0xCE, 0x1C, 0x2D, 0x5D, 0x9A, 0x59, 0x38, 0x30, 0x51, 0xDD, 0xA5, 0xDB, 0x7C, 0x15, 0xFD, 0x99, 0xCB, 0xBA, 0x6D, 0x17, 0x31, 0x41, 0x73, 0x77, 0x34, 0x28, 0xC2, 0x62, 0x79, 0xFE, 0xB5, 0x86, 0xC2, 0xD5, 0xEE, 0xA9, 0xA0, 0xF8, 0x85, 0xA4, 0x74, 0xEF, 0x68, 0xB6, 0xA6, 0x97, 0xED, 0x52, 0x8B, 0xA2, 0x2F, 0x94, 0x48, 0x3F, 0xD0, 0x07, 0x13, 0x9C, 0xE5, 0x69, 0xA1, 0xC4, 0x56, 0x43, 0x3C, 0xAC, 0x0D, 0xCC, 0xBF, 0x83, 0xAB, 0x21, 0x22, 0x96, 0xDF, 0x6A, 0xF4, 0xE0, 0x63, 0xDC, 0x35, 0x39, 0x9F, 0xAE, 0xE1, 0x9B, 0xCF, 0x93, 0xAD, 0xF1, 0x91, 0x1B, 0xD3, 0xC0, 0xF6];
const DDS_IDENTIFIER = 0x20534444;
const GTX_IDENTIFIER = 0x204C414B;

export default class GTXLoader extends THREE.DDSLoader {
  constructor() {
    super();
    this._parser = this.parse;
  }
  parse(buffer, loadMipmaps) {
    const header = new Int32Array(buffer, 0, 1);

    if (header[0] === GTX_IDENTIFIER) {
      //decryption is from Byte 8 to 64
      const decrypt = new Uint8Array(buffer, 8, 64);
      for (let i = 0; i < decrypt.length; i ++) {
        decrypt[i] = GTX_TO_DSS[decrypt[i]];
      }

      header[0] = DDS_IDENTIFIER;
    }

    return THREE.DDSLoader.parse(buffer, loadMipmaps);
  }
};
