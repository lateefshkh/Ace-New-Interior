import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Get password from environment ONLY
    const validPassword = process.env.DASHBOARD_PASSWORD;
    
    // Check if password is set in environment
    if (!validPassword) {
      console.error('❌ DASHBOARD_PASSWORD not set in .env.local');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Trim whitespace from both passwords
    const cleanValid = validPassword.trim();
    const cleanEntered = password.trim();
    
    // Debug logging (remove in production)
    console.log('🔑 Valid password exists: true');
    console.log('🔑 Valid password length:', cleanValid.length);
    console.log('🔑 Entered password length:', cleanEntered.length);
    console.log('🔑 Password match:', cleanValid === cleanEntered);
    
    // Verify password
    if (cleanValid === cleanEntered) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
