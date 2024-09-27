import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = 'DCPqifCgWBC8I+CF9Q4ROYQB48CGPeY119BqOQnnbzYhTajr5uBG7vTsgab3I6Va'; // Replace with your own secret key

// Ensure the key is 32 bytes long when converted from hex
if (Buffer.from(secretKey, 'hex').length !== 32) {
  throw new Error('Invalid key length. Key must be 32 bytes long.');
}

// Function to encrypt data
const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Function to decrypt data
const decrypt = (text: string): string => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
  export async function POST(req: NextRequest) {

    const { cookie, method } = await req.json();
    if (method === 'decrypt') {
      const encryptedValue = cookie;
      if (encryptedValue) {
        const decryptedValue = decrypt(cookie);
        console.log(cookie, method,decryptedValue)

        return NextResponse.json({ value: decryptedValue });
      } else {
        return NextResponse.json({ error: 'Cookie not found' }, { status: 404 });
      }
    } else if (method === 'encrypt') {
      try {
        const encryptedValue = encrypt(cookie);
        console.log(cookie, method,encryptedValue)

        return NextResponse.json({ value: encryptedValue });
      } catch (error) {
        console.error('Error encrypting cookie:', error);
        return NextResponse.json({ error: 'Failed to encrypt cookie' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
    }
  }