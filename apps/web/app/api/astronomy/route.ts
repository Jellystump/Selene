import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('latitude') || '0';
  const lon = searchParams.get('longitude') || '0';
  const today = new Date().toISOString().split('T')[0];

  const targetUrl = `https://astronomyapi.com/api/v2/bodies/positions?latitude=${lat}&longitude=${lon}&elevation=0&from_date=${today}&to_date=${today}&time=00:00:00`;

  const credentials = btoa('bf7c6b84-6d85-4a9a-8b5c-7f201daef9d6:fe06a57b2f56b0968c83d95e5ce94de7e8f9ae457d31a5daa6c0b8d942e82d75dc852ef3f20070b6e21c476b9d9f4f83856d03bb6349305f3472dbc0603a2ee8d89f8bc5825d5a794672c5f03b54d664936f23b6b070e874ec15651d9de629f499e62fa7ea393e6ce39d1ba08c432876');

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
