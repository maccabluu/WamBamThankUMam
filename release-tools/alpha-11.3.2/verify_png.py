from pathlib import Path
import struct
import sys
import zlib


path = Path(sys.argv[1])
data = path.read_bytes()
assert data.startswith(b'\x89PNG\r\n\x1a\n'), f'{path}: bad PNG signature'

position = 8
chunks = []
idat = bytearray()
ihdr = None
seen_iend = False
while position < len(data):
    assert position + 12 <= len(data), f'{path}: truncated chunk header'
    size = struct.unpack('>I', data[position:position + 4])[0]
    kind = data[position + 4:position + 8]
    start = position + 8
    end = start + size
    assert end + 4 <= len(data), f'{path}: truncated {kind!r} chunk'
    payload = data[start:end]
    expected_crc = struct.unpack('>I', data[end:end + 4])[0]
    actual_crc = zlib.crc32(kind + payload) & 0xffffffff
    assert actual_crc == expected_crc, f'{path}: bad {kind!r} CRC'
    chunks.append(kind)
    if kind == b'IHDR':
        ihdr = struct.unpack('>IIBBBBB', payload)
    elif kind == b'IDAT':
        idat.extend(payload)
    elif kind == b'IEND':
        seen_iend = True
        position = end + 4
        break
    position = end + 4

assert position == len(data), f'{path}: trailing bytes after IEND'
assert chunks[0] == b'IHDR' and seen_iend, f'{path}: incomplete PNG'
assert ihdr == (690, 171, 8, 2, 0, 0, 0), f'{path}: unexpected IHDR {ihdr!r}'
decoded = zlib.decompress(bytes(idat))
row_size = 1 + 690 * 3
assert len(decoded) == 171 * row_size, f'{path}: unexpected decoded size'
assert all(decoded[row * row_size] <= 4 for row in range(171)), f'{path}: invalid filter byte'
print(f'{path}: fully decoded 690x171 RGB PNG ({len(data)} bytes)')
