#!/usr/bin/env node

import { toE164, toNational, toE123, toUkE164, toUkNational, toUkE123 } from './index.js';

function printUsage(): void {
  process.stderr.write(
    'Usage: nanp-convert [--plan=nanp|uk] [--national|--e164|--e123] <number> [<number> ...]\n' +
      '\n' +
      '  --plan=nanp  parse numbers as NANP, e.g. US/Canada (default)\n' +
      '  --plan=uk    parse numbers as UK\n' +
      '  --e164       output E.164, e.g. +15551234567 (default)\n' +
      '  --national   output national display format, e.g. (555) 123-4567\n' +
      '  --e123       output E.123 international format, e.g. +1 555 123 4567\n'
  );
}

function main(argv: string[]): number {
  let format: 'e164' | 'national' | 'e123' = 'e164';
  let plan: 'nanp' | 'uk' = 'nanp';
  const numbers: string[] = [];

  for (const arg of argv) {
    if (arg === '--national') {
      format = 'national';
    } else if (arg === '--e164') {
      format = 'e164';
    } else if (arg === '--e123') {
      format = 'e123';
    } else if (arg === '--plan=nanp') {
      plan = 'nanp';
    } else if (arg === '--plan=uk') {
      plan = 'uk';
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      return 0;
    } else {
      numbers.push(arg);
    }
  }

  if (numbers.length === 0) {
    printUsage();
    return 1;
  }

  const converters = plan === 'uk'
    ? { national: toUkNational, e123: toUkE123, e164: toUkE164 }
    : { national: toNational, e123: toE123, e164: toE164 };
  const convert = converters[format];
  let exitCode = 0;

  for (const number of numbers) {
    try {
      process.stdout.write(`${convert(number)}\n`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(`${message}\n`);
      exitCode = 1;
    }
  }

  return exitCode;
}

process.exitCode = main(process.argv.slice(2));
