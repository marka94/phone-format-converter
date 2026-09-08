// North American Numbering Plan (NANP) helpers: US, Canada, and the other
// +1 countries. A number is NXX-NXX-XXXX where N is 2-9 and X is 0-9 --
// area codes and exchange codes can't start with 0 or 1. That's the only
// numbering plan implemented right now; see README for what's next.

const NANP_COUNTRY_CODE = '1';

export interface NanpNumber {
  areaCode: string;
  exchangeCode: string;
  subscriberNumber: string;
}

function stripFormatting(input: string): string {
  return input.replace(/[\s().-]/g, '');
}

function isValidNxx(digits: string): boolean {
  return /^[2-9][0-9]{2}$/.test(digits);
}

/**
 * Parses free-form or E.164 input into its NANP parts. Accepts things like
 * "(555) 123-4567", "555-123-4567", "5551234567", "+15551234567".
 */
export function parseNanp(input: string): NanpNumber {
  let digits = stripFormatting(input);

  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }

  // A leading "1" country code is optional on input; only strip it when the
  // remainder still adds up to a full 10-digit national number, otherwise a
  // valid area code that happens to start with 1... well, it can't, area
  // codes never start with 1, so this is unambiguous.
  if (digits.length === 11 && digits.startsWith(NANP_COUNTRY_CODE)) {
    digits = digits.slice(1);
  }

  if (!/^\d{10}$/.test(digits)) {
    throw new Error(`"${input}" is not a 10-digit NANP number`);
  }

  const areaCode = digits.slice(0, 3);
  const exchangeCode = digits.slice(3, 6);
  const subscriberNumber = digits.slice(6, 10);

  if (!isValidNxx(areaCode)) {
    throw new Error(`"${input}" has an invalid area code (${areaCode})`);
  }
  if (!isValidNxx(exchangeCode)) {
    throw new Error(`"${input}" has an invalid exchange code (${exchangeCode})`);
  }

  return { areaCode, exchangeCode, subscriberNumber };
}

export function formatNanpNational(n: NanpNumber): string {
  return `(${n.areaCode}) ${n.exchangeCode}-${n.subscriberNumber}`;
}

export function formatNanpE164(n: NanpNumber): string {
  return `+${NANP_COUNTRY_CODE}${n.areaCode}${n.exchangeCode}${n.subscriberNumber}`;
}
