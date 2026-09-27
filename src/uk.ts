// UK numbering plan helpers. Real UK numbering is irregular -- area code
// length varies from 2 digits (London, "020") to 5 (some rural exchanges) --
// so this only models the three groupings that cover the overwhelming
// majority of numbers people actually paste in: mobiles (07xxx xxxxxx),
// London (020 xxxx xxxx), and everything else, which almost always follows
// the "0" + 3-digit dialing code + 3 + 4 pattern (0113 234 5678, 0300 123
// 4567, 0800 123 4567, and so on). Numbers with genuinely non-standard area
// code lengths (a handful of small exchanges) will parse and round-trip
// correctly but may print with a grouping that doesn't match how the phone
// company itself writes them.

const UK_COUNTRY_CODE = '44';

export interface UkNumber {
  // National significant number: 10 digits, trunk "0" already stripped.
  nsn: string;
}

function stripFormatting(input: string): string {
  return input.replace(/[\s().-]/g, '');
}

export function parseUk(input: string): UkNumber {
  let digits = stripFormatting(input);

  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }

  if (digits.startsWith(UK_COUNTRY_CODE)) {
    digits = digits.slice(UK_COUNTRY_CODE.length);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (!/^[1-9]\d{9}$/.test(digits)) {
    throw new Error(`"${input}" is not a 10-digit UK national number`);
  }

  return { nsn: digits };
}

function isMobile(nsn: string): boolean {
  return nsn.startsWith('7');
}

function isLondon(nsn: string): boolean {
  return nsn.startsWith('20');
}

export function formatUkNational(n: UkNumber): string {
  const { nsn } = n;

  if (isMobile(nsn)) {
    return `0${nsn.slice(0, 4)} ${nsn.slice(4)}`;
  }
  if (isLondon(nsn)) {
    return `0${nsn.slice(0, 2)} ${nsn.slice(2, 6)} ${nsn.slice(6)}`;
  }
  return `0${nsn.slice(0, 3)} ${nsn.slice(3, 6)} ${nsn.slice(6)}`;
}

export function formatUkE164(n: UkNumber): string {
  return `+${UK_COUNTRY_CODE}${n.nsn}`;
}

export function formatUkE123(n: UkNumber): string {
  const { nsn } = n;

  if (isMobile(nsn)) {
    return `+${UK_COUNTRY_CODE} ${nsn.slice(0, 4)} ${nsn.slice(4)}`;
  }
  if (isLondon(nsn)) {
    return `+${UK_COUNTRY_CODE} ${nsn.slice(0, 2)} ${nsn.slice(2, 6)} ${nsn.slice(6)}`;
  }
  return `+${UK_COUNTRY_CODE} ${nsn.slice(0, 3)} ${nsn.slice(3, 6)} ${nsn.slice(6)}`;
}
