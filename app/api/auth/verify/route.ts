import { NextRequest, NextResponse } from 'next/server';
import { verifyDashboardPassword } from '@/lib/auth/dashboard';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const validPassword = process.env.DASHBOARD_PASSWORD;

    if (!validPassword) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (verifyDashboardPassword(password)) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
