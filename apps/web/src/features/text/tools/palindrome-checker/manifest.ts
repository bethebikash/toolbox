import type { ToolManifest } from '@toolbox/shared/types';
export const palindromeCheckerManifest: ToolManifest = {
  id:'palindrome-checker', slug:'/tools/text/palindrome-checker', category:'text',
  name:'Palindrome Checker', description:'Check if words or phrases are palindromes and find the longest palindromic substring.',
  icon:'arrow-left-right', keywords:['palindrome','reverse','word','phrase','check'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Palindrome Checker Online', description:'Check if text is a palindrome instantly.' },
};
