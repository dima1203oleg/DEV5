const fs = require('fs');

let content = fs.readFileSync('src/components/PersonProfiler.tsx', 'utf8');

const targetStr = `            {isGeneratingDossier ? <span>Генерація... {Math.round(dossierProgress)}%</span> : <span>Все про особу (OSINT + Реєстри)</span>}
          </button>`;

const replacement = `            {isGeneratingDossier ? <span>Генерація... {Math.round(dossierProgress)}%</span> : <span>Все про особу (OSINT + Реєстри)</span>}
          </button>
          
          <button
            onClick={() => alert('Запуск глибинного пошуку компрометуючих матеріалів (dark web, соціальні мережі, реєстри правопорушень)...')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-600/20 hover:bg-rose-600 border border-slate-800 text-xs font-bold text-rose-400 hover:text-white font-mono uppercase tracking-wider cursor-pointer transition-all shrink-0 shadow-lg shadow-rose-950/20"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Компромат</span>
          </button>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync('src/components/PersonProfiler.tsx', content);
  console.log('Kompromat button added.');
} else {
  console.log('Target string not found.');
}
