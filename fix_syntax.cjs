const fs = require('fs');
let code = fs.readFileSync('src/components/PersonProfiler.tsx', 'utf8');

const regex1 = `                </g>

                {/* Connective line asset text labels */}
                {selectedPersonId.startsWith('virtual-') ? (`;

const replace1 = `                </g>
                )}

                {/* Connective line asset text labels */}
                {selectedPersonId.startsWith('virtual-') ? (`;
                
code = code.replace(regex1, replace1);

const regex2 = `                  <text x="315" y="222" fill="#60a5fa">ТОВ "Логістик-Плюс" (100%)</text>
                  <rect x="305" y="265" width="105" height="12" rx="4" fill="#0f172a" stroke="#3b82f6" strokeOpacity="0.4" />
                  <text x="357" y="273" fill="#60a5fa">Рахунки Luminor Bank</text>
                </g>
                )}
                {selectedPersonId.startsWith('virtual-') ? (`;
                
const replace2 = `                  <text x="315" y="222" fill="#60a5fa">ТОВ "Логістик-Плюс" (100%)</text>
                  <rect x="305" y="265" width="105" height="12" rx="4" fill="#0f172a" stroke="#3b82f6" strokeOpacity="0.4" />
                  <text x="357" y="273" fill="#60a5fa">Рахунки Luminor Bank</text>
                </g>
                )}
                
                {selectedPersonId.startsWith('virtual-') ? (`;

code = code.replace(regex2, replace2);

fs.writeFileSync('src/components/PersonProfiler.tsx', code);
