export interface ConversionResult {
  ok:     true;
  output: string;
}
export interface ConversionError {
  ok:    false;
  error: string;
}

function jsonTypeOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const types = [...new Set(value.map(v => jsonTypeOf(v)))];
    const inner = types.join(' | ');
    return types.length > 1 ? `(${inner})[]` : `${inner}[]`;
  }
  if (typeof value === 'object') return 'object'; // handled separately
  return typeof value;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateInterface(obj: Record<string, unknown>, name: string, interfaces: string[]): string {
  const lines: string[] = [`interface ${name} {`];

  for (const [key, value] of Object.entries(obj)) {
    const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;

    if (value === null) {
      lines.push(`  ${safeName}: null;`);
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const childName = capitalize(key.replace(/s$/, ''));
        generateInterface(value[0] as Record<string, unknown>, childName, interfaces);
        lines.push(`  ${safeName}: ${childName}[];`);
      } else {
        lines.push(`  ${safeName}: ${jsonTypeOf(value)};`);
      }
    } else if (typeof value === 'object') {
      const childName = capitalize(key);
      generateInterface(value as Record<string, unknown>, childName, interfaces);
      lines.push(`  ${safeName}: ${childName};`);
    } else {
      lines.push(`  ${safeName}: ${jsonTypeOf(value)};`);
    }
  }

  lines.push('}');
  interfaces.push(lines.join('\n'));
  return name;
}

export function jsonToTypeScript(input: string, rootName = 'Root'): ConversionResult | ConversionError {
  try {
    const parsed = JSON.parse(input);
    const interfaces: string[] = [];

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) return { ok: true, output: `type ${rootName} = unknown[];` };
      if (typeof parsed[0] === 'object' && parsed[0] !== null) {
        generateInterface(parsed[0] as Record<string, unknown>, rootName, interfaces);
        return { ok: true, output: interfaces.reverse().join('\n\n') + `\n\ntype ${rootName}List = ${rootName}[];` };
      }
      return { ok: true, output: `type ${rootName} = ${jsonTypeOf(parsed)};` };
    }

    if (typeof parsed === 'object' && parsed !== null) {
      generateInterface(parsed as Record<string, unknown>, rootName, interfaces);
      return { ok: true, output: interfaces.reverse().join('\n\n') };
    }

    return { ok: true, output: `type ${rootName} = ${jsonTypeOf(parsed)};` };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export const meta = { ready: true };
