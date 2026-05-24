export const revalidate = 300;

import { buildAgroGlobePayload } from '@/lib/agroGlobe';

export async function GET() {
  try {
    const payload = await buildAgroGlobePayload();
    return Response.json(payload);
  } catch (error) {
    console.error('Failed to build agro globe payload:', error);

    return Response.json(
      { error: 'Unable to build agro globe payload right now.' },
      { status: 500 }
    );
  }
}
