const fs = require('fs');
const path = 'src/data/prompts.ts';
const text = fs.readFileSync(path, 'utf8');
const lines = text.split(/\r?\n/);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.includes('promptText:')) continue;
  if (line.includes('promptText: `') || line.includes('promptText: "')) continue;

  const prefix = 'promptText: ';
  const start = line.indexOf(prefix);
  if (start === -1) continue;

  const valueStart = start + prefix.length;
  let value = line.slice(valueStart);

  if (value.startsWith("'")) {
    value = '`' + value.slice(1);
  } else if (!value.startsWith('`')) {
    value = '`' + value;
  }

  const lastSingleQuote = value.lastIndexOf("'");
  if (lastSingleQuote !== -1) {
    value = value.slice(0, lastSingleQuote) + '`' + value.slice(lastSingleQuote + 1);
  } else if (!value.startsWith('`')) {
    value = '`' + value + '`';
  }

  lines[i] = line.slice(0, valueStart) + value;
}

fs.writeFileSync(path, lines.join('\n'));
