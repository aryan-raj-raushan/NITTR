
export function formatObject(obj: any, indentLevel = 1) {
  let result = '';
  const indent = '  '.repeat(indentLevel); // Creates an indentation string based on the current recursion depth
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      result += `${indent}${+key + 1}:\n${formatObject(value, indentLevel + 1)}`;
    } else {
      // Otherwise, just append the key-value pair
      result += `${indent}${key}- ${value}\n`;
    }
  }

  return result;
}

