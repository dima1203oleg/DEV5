const fs = require('fs');
let code = fs.readFileSync('src/components/PersonProfiler.tsx', 'utf8');

code = code.replace(`                </g>

                {/* Connective line asset text labels */}
                </g>
                {selectedPersonId.startsWith('virtual-') ? (`, `                </g>

                {/* Connective line asset text labels */}
                {selectedPersonId.startsWith('virtual-') ? (`);

fs.writeFileSync('src/components/PersonProfiler.tsx', code);
