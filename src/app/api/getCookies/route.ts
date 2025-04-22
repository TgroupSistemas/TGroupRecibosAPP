import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = '71dd225fc44c264fb2fe9f4d5de3965b3ca91306c974db5d14fcaafe41371052'; // Replace with your own secret key

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

        return NextResponse.json({ value: decryptedValue });
      } else {
        return NextResponse.json({ error: 'Cookie not found' }, { status: 404 });
      }
    } else if (method === 'encrypt') {
      try {
        const encryptedValue = encrypt(cookie);

        return NextResponse.json({ value: encryptedValue });
      } catch (error) {
        console.error('Error encrypting cookie:', error);
        return NextResponse.json({ error: 'Failed to encrypt cookie' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
    }
  }