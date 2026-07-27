const fs = require('fs');
let code = fs.readFileSync('src/components/PersonProfiler.tsx', 'utf8');

const regex = /<svg className="w-full h-full" viewBox="0 0 500 360">[\s\S]*?<\/svg>\s*\{\/\* Interconnectivity note overlay \*\/\}[\s\S]*?<\/div>/;

const newSvgBlock = `<svg className="w-full h-full" viewBox="0 0 500 360">
                {selectedPersonId.startsWith('virtual-') ? (
                  <>
                    <g stroke="#334155" strokeWidth="1.5">
                      {/* Neutral Graph for Virtual Search */}
                    </g>
                    <g fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    </g>
                    <g className="cursor-pointer">
                      <circle cx="250" cy="180" r="26" fill="#020617" stroke="#10b981" strokeWidth="2.5" className="stroke-emerald-400" />
                      <text x="250" y="183" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">ОБ'ЄКТ</text>
                      <text x="250" y="220" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">{selectedPerson.name.split(' ')[0]}</text>
                    </g>
                  </>
                ) : (
                  <>
                    {/* Connective lines with risk markers */}
                    <g stroke="#334155" strokeWidth="1.5">
                      <line x1="250" y1="180" x2="110" y2="90" stroke="#f59e0b" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="250" y1="180" x2="110" y2="270" stroke="#3b82f6" strokeDasharray="4 4" />
                      <line x1="250" y1="180" x2="390" y2="90" stroke="#f43f5e" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="250" y1="180" x2="390" y2="270" stroke="#3b82f6" strokeDasharray="4 4" />
                    </g>

                    {/* Connective line asset text labels */}
                    <g fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      <rect x="135" y="115" width="90" height="12" rx="4" fill="#0f172a" stroke="#f59e0b" strokeOpacity="0.4" />
                      <text x="180" y="123" fill="#fbbf24">Вілла Марбелья $3.4M (100%)</text>
                      <rect x="135" y="225" width="90" height="12" rx="4" fill="#0f172a" stroke="#3b82f6" strokeOpacity="0.4" />
                      <text x="180" y="233" fill="#60a5fa">ЖК PecherSky $1.2M (98%)</text>
                      <rect x="275" y="115" width="90" height="12" rx="4" fill="#0f172a" stroke="#f43f5e" strokeOpacity="0.4" />
                      <text x="320" y="123" fill="#f87171">Range Rover $180K (100%)</text>
                      <rect x="275" y="225" width="90" height="12" rx="4" fill="#0f172a" stroke="#3b82f6" strokeOpacity="0.4" />
                      <text x="320" y="233" fill="#60a5fa">Porsche Cay $140K (72%)</text>
                    </g>

                    {/* Nodes group */}
                    <g className="cursor-pointer" onClick={() => setSelectedPersonId('kovalenko-ihor')}>
                      <circle cx="250" cy="180" r="26" fill="#020617" stroke="#3b82f6" strokeWidth="2.5" className={selectedPersonId === 'kovalenko-ihor' ? 'stroke-blue-400' : 'opacity-80'} />
                      <text x="250" y="183" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">ПЕП</text>
                      <text x="250" y="220" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">І. В. Коваленко</text>
                    </g>
                    <g className="cursor-pointer" onClick={() => setSelectedPersonId('petrenko-olha')}>
                      <circle cx="110" cy="90" r="18" fill="#020617" stroke="#f59e0b" strokeWidth="2" className={selectedPersonId === 'petrenko-olha' ? 'stroke-amber-400' : 'opacity-80'} />
                      <text x="110" y="93" textAnchor="middle" fill="#fbbf24" fontSize="7" fontWeight="bold" fontFamily="monospace">ДРУЖИНА</text>
                      <text x="110" y="120" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">О. С. Петренко</text>
                    </g>
                    <g className="cursor-pointer" onClick={() => setSelectedPersonId('petrenko-serhiy')}>
                      <circle cx="110" cy="270" r="18" fill="#020617" stroke="#3b82f6" strokeWidth="2" className={selectedPersonId === 'petrenko-serhiy' ? 'stroke-blue-400' : 'opacity-80'} />
                      <text x="110" y="273" textAnchor="middle" fill="#60a5fa" fontSize="7" fontWeight="bold" fontFamily="monospace">ТЕСТ</text>
                      <text x="110" y="300" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">С. Л. Петренко</text>
                    </g>
                    <g className="cursor-pointer" onClick={() => setSelectedPersonId('kharchenko-dmytro')}>
                      <circle cx="390" cy="90" r="18" fill="#020617" stroke="#f43f5e" strokeWidth="2" className={selectedPersonId === 'kharchenko-dmytro' ? 'stroke-rose-400' : 'opacity-80'} />
                      <text x="390" y="93" textAnchor="middle" fill="#f87171" fontSize="7" fontWeight="bold" fontFamily="monospace">ПРОКСІ</text>
                      <text x="390" y="120" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">Д. П. Харченко</text>
                    </g>
                    <g className="cursor-pointer" onClick={() => setSelectedPersonId('kovalenko-oleksandr')}>
                      <circle cx="390" cy="270" r="18" fill="#020617" stroke="#3b82f6" strokeWidth="2" className={selectedPersonId === 'kovalenko-oleksandr' ? 'stroke-blue-400' : 'opacity-80'} />
                      <text x="390" y="273" textAnchor="middle" fill="#60a5fa" fontSize="7" fontWeight="bold" fontFamily="monospace">БРАТ</text>
                      <text x="390" y="300" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">О. В. Коваленко</text>
                    </g>
                  </>
                )}
              </svg>

              {/* Interconnectivity note overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800/60 px-2 py-1 rounded text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
                <span className={\`w-1.5 h-1.5 rounded-full \${selectedPersonId.startsWith('virtual-') ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse\`}></span>
                <span>{selectedPersonId.startsWith('virtual-') ? "Прямих зв'язків із підсанкційними особами не виявлено" : "Виявлено 4 номінальних проксі-утримувачів"}</span>
              </div>`;

code = code.replace(regex, newSvgBlock);
fs.writeFileSync('src/components/PersonProfiler.tsx', code);
