import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';

const PIN_KEY = 'momentum:pin';
const SESSION_KEY = 'momentum:session';
const DEFAULT_PIN = '1234'; // Initial PIN — Joe can change later

// POST verify PIN
export async function POST(request: Request) {
  try {
    const { pin, action } = await request.json();

    if (action === 'check') {
      // Check if session is valid
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('momentum_session')?.value;
      if (sessionToken) {
        const valid = await redis.get(`${SESSION_KEY}:${sessionToken}`);
        if (valid) {
          return NextResponse.json({ authenticated: true });
        }
      }
      return NextResponse.json({ authenticated: false });
    }

    if (action === 'verify') {
      // Get stored PIN or use default
      const storedPin = await redis.get(PIN_KEY);
      const correctPin = storedPin || DEFAULT_PIN;

      if (pin === correctPin) {
        // Create session token
        const token = crypto.randomUUID();
        await redis.set(`${SESSION_KEY}:${token}`, 'valid', { ex: 60 * 60 * 24 * 7 }); // 7 days

        const response = NextResponse.json({ success: true });
        response.cookies.set('momentum_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        return response;
      }

      return NextResponse.json({ success: false, error: 'Wrong PIN' }, { status: 401 });
    }

    if (action === 'change') {
      const { newPin } = await request.json();
      if (newPin && newPin.length === 4) {
        await redis.set(PIN_KEY, newPin);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'PIN must be 4 digits' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
