# phone-format-converter

Phone numbers show up in different shapes depending on where you got them
from. An API or SMS gateway usually wants E.164 (`+15551234567`). A person
reading a form wants something like `(555) 123-4567`. Databases, CSV exports,
and copy-pasted contact lists end up with a mix of both plus every
punctuation variant in between (`555.123.4567`, `555-123-4567`,
`1 (555) 123-4567`...).

This library normalizes and converts between those two shapes. It covers the
North American Numbering Plan (NANP) -- the US, Canada, and the other +1
countries -- since that's what most people mean by "phone number" when they
haven't said otherwise, plus a second numbering plan for the UK. See Roadmap
below for what's not covered yet.

## Usage

```ts
import { toE164, toNational, toE123, isValidNanpNumber } from './src/index.js';

toE164('(555) 123-4567');        // '+15551234567'
toE164('555.123.4567');          // '+15551234567'
toE164('1-555-123-4567');        // '+15551234567'

toNational('+15551234567');      // '(555) 123-4567'
toNational('5551234567');        // '(555) 123-4567'

toE123('5551234567');            // '+1 555 123 4567'

isValidNanpNumber('555-123-4567'); // true
isValidNanpNumber('123-456-7890'); // false -- area code can't start with 1
```

```ts
import { toUkE164, toUkNational, toUkE123, isValidUkNumber } from './src/index.js';

toUkE164('07911 123456');        // '+447911123456'
toUkE164('020 7946 0958');       // '+442079460958'

toUkNational('+447911123456');   // '07911 123456'
toUkNational('+442079460958');   // '020 7946 0958'

toUkE123('07911123456');         // '+44 7911 123456'

isValidUkNumber('0113 234 5678'); // true
```

UK area code lengths vary (2 digits for London, up to 5 for a handful of
small exchanges); this library only special-cases mobiles and London and
falls back to the 3-3-4 grouping that covers the rest of the country. See
`src/uk.ts` for the exact scope.

Invalid input throws an `Error` with a message describing what was wrong
(wrong length, bad area code, bad exchange code) rather than silently
returning something incorrect.

## CLI

```
node dist/cli.js (555) 123-4567
+15551234567

node dist/cli.js --national +15551234567
(555) 123-4567

node dist/cli.js --e123 5551234567
+1 555 123 4567

node dist/cli.js 555-123-4567 1-555-999-9999
+15551234567
+15559999999

node dist/cli.js --plan=uk --national +447911123456
07911 123456
```

Takes one or more numbers as arguments and converts each on its own line.
Defaults to NANP, E.164 output; pass `--plan=uk` to parse as UK numbers
instead, and `--national` or `--e123` for the other output formats.
A number that fails to parse prints its error to stderr and the process
exits non-zero, but the rest of the batch still runs. If installed globally
or linked (`npm link`), the same thing is available as `nanp-convert`.

## What counts as valid

NANP numbers are ten digits, `NXX-NXX-XXXX`, where `N` is 2-9 and `X` is
0-9. Area codes and exchange codes can't start with 0 or 1. This library
checks that shape but doesn't check whether a given area code has actually
been assigned -- that list changes too often to hardcode.

## Building

```
npm install
npm run build
```

Compiles `src/` to `dist/` with the TypeScript compiler. No other build step.

## Roadmap

- Batch conversion over a CSV or newline-delimited input file
- Basic test suite

## License

MIT, see LICENSE.
