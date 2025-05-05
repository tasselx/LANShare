import { NextResponse } from 'next/server';
import ip from 'ip';

export async function GET() {
  const localIP = ip.address();
  const PORT = process.env.PORT || '3001';
  
  return NextResponse.json({
    ip: localIP,
    port: PORT
  });
}
