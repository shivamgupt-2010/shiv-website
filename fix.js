const fs = require('fs');
const path = require('path');
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf8');
      if (c.includes("import { db } from '@/lib/db'")) {
        c = c.replace(/import \{ db \} from '@\/lib\/db'/g, "import db from '@/lib/db'");
        fs.writeFileSync(p, c);
        console.log("Fixed " + p);
      }
    }
  }
}
walk('src/app');
console.log('Done');
