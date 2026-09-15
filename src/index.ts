import { parseNanp, formatNanpNational, formatNanpE164, formatNanpE123 } from './nanp.js';
import type { NanpNumber } from './nanp.js';

export type { NanpNumber };

/**
 * Converts a NANP phone number, in any reasonably common input format,
 * to E.164 (e.g. "+15551234567"). Throws if the input isn't a valid
 * 10-digit NANP number.
 */
export function toE164(input: string): string {
  return formatNanpE164(parseNanp(input));
}

/**
 * Converts a NANP phone number to the conventional US/Canada display
 * format (e.g. "(555) 123-4567").
 */
export function toNational(input: string): string {
  return formatNanpNational(parseNanp(input));
}

/**
 * Converts a NANP phone number to ITU-T E.123 international format
 * (e.g. "+1 555 123 4567"), the country-neutral form meant to be
 * readable and dialable regardless of where the reader is.
 */
export function toE123(input: string): string {
  return formatNanpE123(parseNanp(input));
}

/** True if the input parses as a valid NANP number, false otherwise. */
export function isValidNanpNumber(input: string): boolean {
  try {
    parseNanp(input);
    return true;
  } catch {
    return false;
  }
}
