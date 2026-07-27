const fs = require('fs');
let code = fs.readFileSync('src/components/PersonProfiler.tsx', 'utf8');
code = code.replace("email: `${extractedName.split(' ')[0]?.toLowerCase() || 'info'}@gmail.com`,", "email: `info@v-search.local`,");
fs.writeFileSync('src/components/PersonProfiler.tsx', code);
