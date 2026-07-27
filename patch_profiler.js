const fs = require('fs');

let code = fs.readFileSync('src/components/PersonProfiler.tsx', 'utf8');

// 1. Update the graph rendering part
const oldGraph = `<g stroke="#334155" strokeWidth="1.5">
                  {/* Kovalenko (250, 180) to Olga Wife (110, 90) */}
                  <line x1="250" y1="180" x2="110" y2="90" stroke="#f59e0b" strokeDasharray="4 4" className="animate-pulse" />`;

const newGraph = `{selectedPersonId.startsWith('virtual-') ? (
                  <g stroke="#334155" strokeWidth="1.5">
                    {/* Neutral Graph for Virtual Search */}
                  </g>
                ) : (
                <g stroke="#334155" strokeWidth="1.5">
                  {/* Kovalenko (250, 180) to Olga Wife (110, 90) */}
                  <line x1="250" y1="180" x2="110" y2="90" stroke="#f59e0b" strokeDasharray="4 4" className="animate-pulse" />`;
code = code.replace(oldGraph, newGraph);

// Also wrap the rest of the nodes with the condition
const oldLabels = `<g fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  <rect x="135" y="115" width="90" height="12" rx="4" fill="#0f172a" stroke="#f59e0b" strokeOpacity="0.4" />`;
const newLabels = `</g>
                {selectedPersonId.startsWith('virtual-') ? (
                  <g fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  </g>
                ) : (
                <g fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  <rect x="135" y="115" width="90" height="12" rx="4" fill="#0f172a" stroke="#f59e0b" strokeOpacity="0.4" />`;
code = code.replace(oldLabels, newLabels);

const oldNodes = `{/* Central main Node (Ihor Kovalenko) */}
                <g className="cursor-pointer" onClick={() => setSelectedPersonId('kovalenko-ihor')}>`;
const newNodes = `</g>
                )}
                {selectedPersonId.startsWith('virtual-') ? (
                <g className="cursor-pointer">
                  <circle cx="250" cy="180" r="26" fill="#020617" stroke="#10b981" strokeWidth="2.5" className="stroke-emerald-400" />
                  <text x="250" y="183" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">ОБ'ЄКТ</text>
                  <text x="250" y="220" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">{selectedPerson.name.split(' ')[0]}</text>
                </g>
                ) : (
                <>
                {/* Central main Node (Ihor Kovalenko) */}
                <g className="cursor-pointer" onClick={() => setSelectedPersonId('kovalenko-ihor')}>`;
code = code.replace(oldNodes, newNodes);

const oldNotes = `</g>
              </svg>
              {/* Interconnectivity note overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800/60 px-2 py-1 rounded text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Виявлено 4 номінальних проксі-утримувачів</span>
              </div>`;
const newNotes = `</g>
                </>
                )}
              </svg>
              {/* Interconnectivity note overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800/60 px-2 py-1 rounded text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
                <span className={\`w-1.5 h-1.5 rounded-full \${selectedPersonId.startsWith('virtual-') ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse\`}></span>
                <span>{selectedPersonId.startsWith('virtual-') ? 'Прямих зв\\'язків із підсанкційними особами не виявлено' : 'Виявлено 4 номінальних проксі-утримувачів'}</span>
              </div>`;
code = code.replace(oldNotes, newNotes);


fs.writeFileSync('src/components/PersonProfiler.tsx', code);
