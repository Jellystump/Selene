import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get('latitude') || '0';
  const longitude = searchParams.get('longitude') || '0';

  const today = new Date();
  const nextYear = new Date();
  nextYear.setDate(today.getDate() + 30); 

  const from_date = today.toISOString().split('T')[0];
  const to_date = nextYear.toISOString().split('T')[0];
  const time = '00:00:00';
  const elevation = '0';

  const appId = 'bf7c6b84-6d85-4a9a-8b5c-7f201daef9d6';
  const appSecret = 'fe06a57b2f56b0968c83d95e5ce94de7e8f9ae457d31a5daa6c0b8d942e82d75dc852ef3f20070b6e21c476b9d9f4f83856d03bb6349305f3472dbc0603a2ee8d89f8bc5825d5a794672c5f03b54d664936f23b6b070e874ec15651d9de629f499e62fa7ea393e6ce39d1ba08c432876';

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: 'API credentials missing in environment variables' },
      { status: 500 }
    );
  }

  const authHeader = `Basic ${Buffer.from(`${appId}:${appSecret}`).toString('base64')}`;

  const apiUrl = `https://api.astronomyapi.com/api/v2/bodies/events/moon?latitude=${latitude}&longitude=${longitude}&elevation=${elevation}&from_date=${from_date}&to_date=${to_date}&time=${time}&output=rows`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Astronomy API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error fetching astronomy data' },
      { status: 500 }
    );
  }
}