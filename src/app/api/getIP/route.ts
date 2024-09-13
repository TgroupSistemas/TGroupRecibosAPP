import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
      const ip = req.headers.get('x-forwarded-for') || req.ip;
      return NextResponse.json({ ip });
    } catch (error) {
      console.error('Error retrieving IP address:', error);
      return NextResponse.json({ error: 'Failed to retrieve IP address' }, { status: 500 });
    }
  }