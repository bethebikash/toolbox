export type SpaceMode =
  | 'extra'      // collapse multiple spaces to one
  | 'all'        // remove all spaces
  | 'leading'    // remove leading whitespace per line
  | 'trailing'   // remove trailing whitespace per line
  | 'both'       // trim each line
  | 'blank-lines'; // remove blank lines

export const MODE_LABELS: Record<SpaceMode, string> = {
  extra:        'Remove extra spaces',
  all:          'Remove all spaces',
  leading:      'Remove leading spaces',
  trailing:     'Remove trailing spaces',
  both:         'Trim each line',
  'blank-lines':'Remove blank lines',
};

export function removeSpaces(input: string, mode: SpaceMode): string {
  switch (mode) {
    case 'extra':        return input.replace(/ {2,}/g, ' ');
    case 'all':          return input.replace(/ /g, '');
    case 'leading':      return input.split('\n').map(l => l.trimStart()).join('\n');
    case 'trailing':     return input.split('\n').map(l => l.trimEnd()).join('\n');
    case 'both':         return input.split('\n').map(l => l.trim()).join('\n');
    case 'blank-lines':  return input.split('\n').filter(l => l.trim() !== '').join('\n');
  }
}

export const meta = { ready: true };
