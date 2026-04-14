// TODO: Swap test keys for live keys before go-live
// Test keys are safe for development only

export interface NINVerificationResult {
  verified: boolean;
  firstName?: string;
  lastName?: string;
  error?: string;
}

export async function verifyNIN(nin: string): Promise<NINVerificationResult> {
  try {
    const res = await fetch(
      `${process.env.PREMBLY_BASE_URL}/api/v2/biometrics/merchant/data/verification/nin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.PREMBLY_SECRET_KEY!,
          'app-id': process.env.PREMBLY_PUBLIC_KEY!,
        },
        body: JSON.stringify({ number: nin }),
      }
    );

    const data = await res.json();

    if (data.verification?.status === 'VERIFIED') {
      return {
        verified: true,
        firstName: data.verification.data?.firstname,
        lastName: data.verification.data?.lastname,
      };
    }

    return {
      verified: false,
      error: data.detail || 'Verification failed. Please check your NIN and try again.',
    };
  } catch (error) {
    console.error('Prembly NIN verification error:', error);
    return {
      verified: false,
      error: 'Verification service temporarily unavailable. Please try again.',
    };
  }
}
