import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';



  export async function POST(req: NextRequest) {

    const { error } = await req.json();
    if (error) {
      console.log('Error:', error);
      return NextResponse.json({ message: 'Error logged successfully' }, { status: 200 });
    }
    return NextResponse.json({ message: 'No error provided' }, { status: 400 });
  }