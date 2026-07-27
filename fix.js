const fs = require('fs');
let content = fs.readFileSync('src/components/AutonomousFactory.tsx', 'utf8');

const regex = /<div className="bg-slate-950\/60 border border-slate-900 hover:border-slate-800 transition-all rounded-xl p-5 relative overflow-hidden flex flex-col justify-center min-h-\[160px\]">\s*<div className="absolute top-0 right-0 w-80 h-80 bg-pink-500\/5 blur-3xl pointer-events-none" \/>[\s\S]*?{\/\* Roles Section \*\//m;

const replacement = `<div className="bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all rounded-xl p-5 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/5 blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black tracking-widest text-slate-100 uppercase font-mono">MISSION</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Autonomous intelligence acquisition.</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                    Ця архітектура перетворює PREDATOR з платформи ручного збору даних на автономну <span className="text-pink-400 font-bold">AI Intelligence Acquisition Platform</span>, яка сама знаходить нові джерела та інтегрує їх.
                  </p>
                </div>
              </div>

              {/* Roles Section */`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/AutonomousFactory.tsx', content);
  console.log('Fixed Mission Statement');
} else {
  console.log('Regex did not match');
}
