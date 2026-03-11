/**
 * Google Search Console verification placeholder.
 * Replace the content with your actual verification meta tag or file content
 * when you get the verification code from Google Search Console.
 *
 * Option 1: Add to layout.tsx head:
 *   <meta name="google-site-verification" content="YOUR_CODE" />
 *
 * Option 2: If Google gives you a file (e.g. google123.html), place it in
 * app/google123.html and serve it, or use this route to return the content.
 */
import { NextResponse } from 'next/server';

const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || '';

export async function GET() {
  if (!GOOGLE_VERIFICATION) {
    return new NextResponse('Set GOOGLE_SITE_VERIFICATION in env to enable.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  return new NextResponse(`google-site-verification: ${GOOGLE_VERIFICATION}`, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
