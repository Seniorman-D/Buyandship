export interface NINVerificationResult {
  verified: boolean;
  firstName?: string;
  lastName?: string;
  error?: string;
}

export async function verifyNIN(nin: string): Promise<NINVerificationResult> {
  const baseUrl = (process.env.PREMBLY_BASE_URL || 'https://api.prembly.com').replace(/\/$/, '');

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/identitypass/verification/nin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.PREMBLY_SECRET_KEY!,
        'app-id': process.env.PREMBLY_PUBLIC_KEY!,
      },
      body: JSON.stringify({ number_nin: nin }),
    });
  } catch (fetchErr) {
    console.error('Prembly fetch error:', fetchErr);
    return { verified: false, error: 'Verification service temporarily unavailable. Please try again.' };
  }

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    console.error('Prembly non-JSON response, HTTP', res.status);
    return { verified: false, error: 'Verification service returned an unexpected response.' };
  }

  console.log('Prembly response:', JSON.stringify(data));

  // Live API response: { status: true, data: { firstname, surname, ... } }
  if (data.status === true && data.data) {
    const d = data.data as Record<string, string>;
    return {
      verified: true,
      firstName: d.firstname || d.first_name || '',
      lastName: d.surname || d.lastname || d.last_name || '',
    };
  }

  // Sandbox/legacy response: { verification: { status: "VERIFIED", data: { firstname, lastname } } }
  const ver = data.verification as Record<string, unknown> | undefined;
  if (ver?.status === 'VERIFIED') {
    const d = ver.data as Record<string, string> | undefined;
    return {
      verified: true,
      firstName: d?.firstname || '',
      lastName: d?.lastname || '',
    };
  }

  return {
    verified: false,
    error: (data.detail as string) || 'Verification failed. Please check your NIN and try again.',
  };
}
