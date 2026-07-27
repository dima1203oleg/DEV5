const fs = require('fs');
const content = fs.readFileSync('src/components/OsintWorkbench.tsx', 'utf-8');
const target = `                  <FileDown className="w-4 h-4" />
                  <span>Так, продовжити експорт</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}`;
const replacement = `                  <FileDown className="w-4 h-4" />
                  <span>Так, продовжити експорт</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Data Sources / APIs Modal */}
      <AnimatePresence>
        {showDataSourcesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                    <Database className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest font-mono">Інтеграції та Бази Даних</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Підключені реєстри, API-шлюзи та закриті джерела (PREDATOR ENGINE)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDataSourcesModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/50 space-y-6">
                
                {/* 1. State Registries (Open) */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Публічні державні реєстри (Live)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">ЄДРПОУ (Юридичні особи)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">ONLINE</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Єдиний державний реєстр. Дані про засновників, бенефіціарів, КВЕД, статус.</p>
                      <div className="text-[9px] font-mono text-slate-600">API: api.gov.ua / GraphQL</div>
                    </div>
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Судова влада України</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">ONLINE</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Реєстр судових рішень. Цивільні, кримінальні та господарські справи.</p>
                      <div className="text-[9px] font-mono text-slate-600">API: court.gov.ua / REST</div>
                    </div>
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Податкова (ДПС)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">ONLINE</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Статус платника ПДВ, податковий борг, анульовані ліцензії.</p>
                      <div className="text-[9px] font-mono text-slate-600">API: tax.gov.ua / SOAP/REST</div>
                    </div>
                  </div>
                </div>

                {/* 2. Closed / Restricted Databases */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Обмежений доступ (Закриті БД МВС / Інтерпол)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-1">
                        <Lock className="w-3 h-3 text-indigo-500/40" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">АРМОР МВС (Дзеркало)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">AUTHORIZED</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Розшук, судимості, зброя, автотранспорт, перетин кордону.</p>
                      <div className="text-[9px] font-mono text-indigo-500/60 flex items-center gap-1">
                        <ExternalLink className="w-2 h-2" /> СБУ VPN GATEWAY
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-1">
                        <Lock className="w-3 h-3 text-indigo-500/40" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">INTERPOL Red/Yellow Notices</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">AUTHORIZED</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Міжнародний розшук, тероризм, фінансові махінації, відмивання коштів.</p>
                      <div className="text-[9px] font-mono text-indigo-500/60 flex items-center gap-1">
                        <ExternalLink className="w-2 h-2" /> INTERPOL SECURE API
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Darknet / Data Leaks */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest font-mono flex items-center gap-2">
                    <ServerCrash className="w-3.5 h-3.5" /> Витоки даних, Darknet, Криптоаналіз
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Data Leaks (2020-2024)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono animate-pulse">INDEXED</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Злиті бази Нової Пошти, ПриватБанку, Kyivstar, Дії (агреговані дампи). Паролі, телефони.</p>
                      <div className="text-[9px] font-mono text-rose-500/60">SOURCE: RaidForums / BreachForums Archive</div>
                    </div>
                    <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Blockchain Analytics</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">ONLINE</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Моніторинг Tornado Cash, міксерів, AML-скоринг криптогаманців.</p>
                      <div className="text-[9px] font-mono text-slate-600">API: Chainalysis / Crystal Blockchain</div>
                    </div>
                  </div>
                </div>

                {/* AI Synthesis Notice */}
                <div className="mt-8 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex gap-4 items-start">
                  <div className="p-2 rounded bg-indigo-500/10 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Інтелектуальний OSINT-пошук (AI Aggregation)</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      У випадках відсутності об'єкта в локальній базі, <span className="font-bold text-indigo-400">PREDATOR AI ENGINE</span> автоматично підключається до вищезазначених джерел через API, аналізує неструктуровані дані (у т.ч. дампи з Darknet та закриті БД МВС), і синтезує єдине досьє з графом зв'язків у реальному часі.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}`;
const newContent = content.replace(target, replacement);
if (newContent !== content) {
  fs.writeFileSync('src/components/OsintWorkbench.tsx', newContent);
  console.log('Successfully patched the file.');
} else {
  console.log('Failed to patch the file. Target string not found.');
}
