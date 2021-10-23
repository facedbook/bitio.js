function bit_stream(file) {
    this.file = file;
    this.mask = 0x80;
    this.rack = 0;
}
 
bit_stream.prototype.sequence_read_bits = function (bytes, bit_count) {
    let mask;
    let value = 0;
    
    mask = 1 << ( bit_count - 1 );
 
    while ( mask != 0) {
        if ( bit_file.mask == 0x80 ) {
            bit_file.rack = getc( bit_file.file );
        }
        
        if ( bit_file.rack & bit_file.mask ) {
            return_value |=mask;
        }
        mask >>= 1;
        bit_file.mask >>= 1;
        if ( bit_file.mask == 0 ) {
            bit_file.mask = 0x80;
        }
    }
    return( return_value );
}
 
bit_stream.prototype.sequence_write_bits = function() {
    let mask;
    
    mask = 1 << ( count - 1 );
    while ( mask != 0) {
        if ( mask & code )
            bit_file.rack |= bit_file.mask;
        bit_file.mask >>= 1;
        
        if ( bit_file.mask == 0 ) {
            putc( bit_file.rack, bit_file.file )
            
            bit_file.rack = 0;
            bit_file.mask = 0x80;
        }
        mask >>= 1;
    }
}
 
function generate_bit_mask(n) {
    if (n <= 0) {
        return 0x0;
    }
    else {
        return (1 << n) - 1;
    }
}
 
/**
 *   Reads a number from a byte array at the specified position
 *   @param bit_count - integer - the number of bits to read
 *   @param bit_pos - integer - the position in bits at which to read
 *   @param bytes - Uint8Array - the bytes to read from
 *   @return - integer - the number that was read
 */
function random_read_bits(bytes, bit_pos, bit_count)
{
    let value = 0;
 
    let bits_left = bit_count;
    let bits_used = 0;
    let byte_pos = Math.floor(bit_pos / 8);
 
    // 1. Read from the remaining bits left in the byte
    let bits_used_in_byte = bit_pos % 8;
    let bits_left_in_byte = 8 - bits_used_in_byte;
    value |= (bytes[byte_pos] >> bits_used_in_byte) & generate_bit_mask(bit_count);  
    bits_left -= bits_left_in_byte;
    bits_used += bits_left_in_byte;
    byte_pos++;
 
 
    // 2. Read all full bytes
    while (bits_left >= 8) {
        value |= bytes[byte_pos] << bits_used;
        bits_left -= 8;
        bits_used += 8;
        byte_pos++;
    }
 
    // 3. Read leftover bits from lower bits of last byte
    value |= (bytes[byte_pos] & generate_bit_mask(bits_left)) << bits_used;
 
 
    return value;
}
 
 
 
/**
 *  
 * @param {uint8array} bytes - array to write to
 * @param {integer} bit_pos - start postion to write
 * @param {integer} value - value to write
 * @param {integer} bit_count - number of bits to write
 */
function random_write_bits(bytes, bit_pos, value, bit_count)
{
    let bits_left = bit_count;
    let byte_pos = Math.floor(bit_pos / 8);
 
    // 1. Write to the remaining bits left in the byte
    let bits_used_in_byte = bit_pos % 8;
    let bits_left_in_byte = 8 - bits_used_in_byte;
 
    bytes[byte_pos] &= ~(generate_bit_mask(Math.min(bits_left_in_byte, bit_count)) << bits_used_in_byte);  
    bytes[byte_pos] |= value << bits_used_in_byte;  
     
    value >>= bits_left_in_byte;
    bits_left -= bits_left_in_byte;
    byte_pos++;
 
    // 2. Write all full bytes
    while (bits_left >= 8) {
        bytes[byte_pos] = 0;
        bytes[byte_pos] = value & 0xFF;
        value >>= 8;
        bits_left -= 8;
        byte_pos++;
    }
 
    // 3. Write leftover bits to lower bits of last byte
    bytes[byte_pos] &= ~generate_bit_mask(bits_left);
    bytes[byte_pos] |= value;
 
}
