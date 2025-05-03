
// Enhanced spelling and grammar correction
export const correctInput = (input: string): string => {
  // Common spelling corrections
  const spellingCorrections: Record<string, string> = {
    'programing': 'programming',
    'programm': 'program',
    'flowchart': 'flowchart',
    'databse': 'database',
    'javascript': 'JavaScript',
    'python': 'Python',
    'sql': 'SQL',
    'computa': 'computer',
    'computar': 'computer',
    'degre': 'degree',
    'univsity': 'university',
    'universti': 'university',
    'cours': 'course',
    'netwok': 'network',
    'netwrk': 'network',
    'programer': 'programmer',
    'programmar': 'programmer',
    'algoritm': 'algorithm',
    'algorthm': 'algorithm',
    'struture': 'structure',
    'binarry': 'binary',
    'enterpris': 'enterprise',
    'enterpise': 'enterprise',
    'buget': 'budget',
    'hackin': 'hacking',
    'copyrght': 'copyright',
    'tredmark': 'trademark',
    'budgetin': 'budgeting',
    'cumputa': 'computer',
    'komputer': 'computer',
    'suftware': 'software',
  };

  // Replace misspelled words
  const processedInput = input.split(' ').map(word => {
    const lowerWord = word.toLowerCase().replace(/[.,?!;:]/g, '');
    return spellingCorrections[lowerWord] || word;
  }).join(' ');

  return processedInput;
};
