#!/usr/bin/env node

import { toE164, toNational } from './index.js';

function printUsage(): void {
  process.stderr.write(
    'Usage: nanp-convert [--national|--e164] <number> [<number> ...]\n' +
      '\n' +
      '  --e164      output E.164, e.g. +15551234567 (default)\n' +
      '  --national  output national display format, e.g. (555) 123-4567\n'
  );
}

function main(argv: string[]): number {
  let format: 'e164' | 'national' = 'e164';
  const numbers: string[] = [];

  for (const arg of argv) {
    if (arg === '--national') {
      format = 'national';
    } else if (arg === '--e164') {
      format = 'e164';
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

  const convert = format === 'national' ? toNational : toE164;
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
