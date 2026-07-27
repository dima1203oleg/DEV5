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

// Fix regex in handleCustomSearch
const handleCustomSearchOld = `        // 1. Name
        const nameMatch = customSearchName.match(/^([А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+(?:\\s+[А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+){1,2})/);
        if (nameMatch) {
          extractedName = nameMatch[1];
        } else if (customSearchName.includes(',')) {
          extractedName = customSearchName.split(',')[0].trim();
        }`;
const handleCustomSearchNew = `        // 1. Name
        const nameMatch = customSearchName.match(/^([А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+(?:\\s+[А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+){1,2})/);
        if (nameMatch) {
          extractedName = nameMatch[1];
        } else if (customSearchName.includes(',')) {
          extractedName = customSearchName.split(',')[0].trim();
        }
        
        // Extract phone if exists
        let extractedPhone = '+380 (50) 998-12-34'; // default
        const phoneMatch = customSearchName.match(/(?:телефон|тел\\.?|моб\\.?|т\\.?|phone|tel)[:\\s]*([+0-9\\-\\(\\)\\s]{10,20})/i);
        if (phoneMatch) {
          let p = phoneMatch[1].replace(/[^\\d+]/g, '');
          if (p.length === 10) p = '+38' + p;
          else if (p.length === 12 && !p.startsWith('+')) p = '+' + p;
          extractedPhone = p;
        }`;
code = code.replace(handleCustomSearchOld, handleCustomSearchNew);

// Replace phone in newPerson
const oldPhoneObj = `          address: extractedAddress,
          phone: '+380 (50) 998-12-34',`;
const newPhoneObj = `          address: extractedAddress,
          phone: extractedPhone,`;
code = code.replace(oldPhoneObj, newPhoneObj);

// Neutralize AI Search Logs
const oldLogs = `    const searchLogs = [
      \`[OSINT] Ініційовано ШІ-пошук по базах даних для особи: "\${customSearchName}"...\`,
      \`[DATABASE] Сканування бази паспортів МВС та прикордонної служби...\`,
      \`[DATABASE] Пошук збігів у базах ДПС (Декларації, доходи, родинні зв'язки)...\`,
      \`[DARKNET] Пошук у витоках баз даних Нова Пошта, ПриватБанк, КМДА (2020-2024)...\`,
      \`[RECORDS] Сканування судового реєстру та санкційних списків РНБО/OFAC...\`,
      \`[LINK_ANALYSIS] Побудова первинного графу зв'язків з бенефіціарами та засновниками компаній...\`,
      \`[SYNTHESIS] Аналіз завершено. Створено динамічний профіль у реєстрі OSINT Workbench.\`,
      \`[УСПІХ] Профіль особи "\${customSearchName}" успішно завантажено в інтерактивний профайлер.\`
    ];`;
const newLogs = `    const searchLogs = [
      \`[OSINT] Ініційовано розширений ШІ-пошук: "\${customSearchName}"...\`,
      \`[DATABASE] Сканування бази паспортів МВС та прикордонної служби... (Збігів з розшуком не знайдено)\`,
      \`[DATABASE] Пошук збігів у базах ДПС (ІПН підтверджено, компанії не знайдені)...\`,
      \`[DARKNET] Пошук у витоках баз даних... (Збігів не виявлено)\`,
      \`[RECORDS] Сканування ЄДРСР (судовий реєстр) та санкційних списків РНБО... (Чисто)\`,
      \`[LINK_ANALYSIS] Побудова первинного графу зв'язків... (Немає афілійованих осіб)\`,
      \`[SYNTHESIS] Аналіз завершено. Створено нейтральний профіль.\`,
      \`[УСПІХ] Профіль особи завантажено в інтерактивний профайлер.\`
    ];`;
code = code.replace(oldLogs, newLogs);

fs.writeFileSync('src/components/PersonProfiler.tsx', code);
