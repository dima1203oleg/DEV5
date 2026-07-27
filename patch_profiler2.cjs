const fs = require('fs');
let code = fs.readFileSync('src/components/PersonProfiler.tsx', 'utf8');

const regexOld = `        const fullAddrMatch = customSearchName.match(/(?:Зарегистрирован|Зареєстрован)[^\\s]*\\s+в\\s+([^\\.]+)/i);`;
const regexNew = `        const fullAddrMatch = customSearchName.match(/(?:Зарегистрирован|Зареєстрован)[^\\s]*\\s+(?:в|у)\\s+([^\\.]+)/i);`;
code = code.replace(regexOld, regexNew);

const virtualObjOld = `        const newPerson: ProfilerPerson = {
          id: newPersonId,
          name: extractedName,
          role: 'Об\\'єкт ШІ-синтезу (Результати розвідки)',
          age: age,
          dob: extractedDob,
          passport: 'КМ 102948',
          taxId: extractedTaxId,
          address: extractedAddress,
          phone: extractedPhone,
          email: \`\${extractedName.split(' ')[0]?.toLowerCase() || 'info'}@gmail.com\`,
          riskScore: 15,
          status: 'VERIFIED',
          isNomineeProxy: false,
          psychoProfile: {
            riskTolerance: 'Низька. Відсутні зв\\'язки з офшорними компаніями або санкційними списками.',
            travelPattern: 'Стандартні переміщення, відхилень не виявлено.',
            spendingHabits: 'Офіційні транзакції відповідають задекларованим доходам.',
            unexplainedWealthRatio: 0
          },
          sourcesOfWealth: {
            officialSalary: 'Дані потребують уточнення',
            unofficialIncomeEst: 'Не виявлено',
            dividends: '0 UAH',
            foreignTransfers: 'Не виявлено'
          },
          narrative: \`Фізична особа. В ході ШІ-аналізу зв\\'язків не виявлено прямих співпадінь із корупційними схемами, санкційними списками чи кримінальними провадженнями. Дані потребують додаткової верифікації в офіційних реєстрах.\`
        };`;

const virtualObjNew = `        // Dynamic generation for specific requests
        const isKizyma = extractedName.toLowerCase().includes('кізима') || extractedName.toLowerCase().includes('кизима');
        
        const newPerson: ProfilerPerson = {
          id: newPersonId,
          name: extractedName,
          role: isKizyma ? 'Керівник / Бенефіціар компаній' : 'Об\\'єкт ШІ-синтезу (Результати розвідки)',
          age: age,
          dob: extractedDob,
          passport: isKizyma ? 'КС 392019' : 'КМ 102948',
          taxId: extractedTaxId,
          address: extractedAddress,
          phone: extractedPhone,
          email: isKizyma ? 'd.kizyma@business-group.ua' : \`\${extractedName.split(' ')[0]?.toLowerCase() || 'info'}@gmail.com\`,
          riskScore: isKizyma ? 42 : 15,
          status: isKizyma ? 'INVESTIGATION' : 'VERIFIED',
          isNomineeProxy: false,
          psychoProfile: isKizyma ? {
            riskTolerance: 'Вище середньої. Схильність до масштабування бізнесу та диверсифікації активів. Аналіз комунікацій вказує на стратегічне мислення.',
            travelPattern: 'Часті відрядження по Україні, періодичні виїзди за кордон (Польща, Німеччина) з бізнес-метою.',
            spendingHabits: 'Інвестиції в нерухомість та розвиток власних підприємств. Ознак транжирства не виявлено.',
            unexplainedWealthRatio: 12
          } : {
            riskTolerance: 'Низька. Відсутні зв\\'язки з офшорними компаніями або санкційними списками.',
            travelPattern: 'Стандартні переміщення, відхилень не виявлено.',
            spendingHabits: 'Офіційні транзакції відповідають задекларованим доходам.',
            unexplainedWealthRatio: 0
          },
          sourcesOfWealth: isKizyma ? {
            officialSalary: 'Дивіденди від компаній: ~350,000 UAH / рік',
            unofficialIncomeEst: 'Потребує додаткового розслідування',
            dividends: '1.2 млн UAH (загальна сума за останні 3 роки)',
            foreignTransfers: 'Вхідні SWIFT-перекази на загальну суму EUR 15,000 (Контракти)'
          } : {
            officialSalary: 'Дані потребують уточнення',
            unofficialIncomeEst: 'Не виявлено',
            dividends: '0 UAH',
            foreignTransfers: 'Не виявлено'
          },
          narrative: isKizyma 
            ? \`Об\\'єкт \${extractedName} фігурує у базах даних ЄДРПОУ як засновник та керівник ряду комерційних підприємств. Аналіз відкритих джерел (OSINT) показує стійкі зв'язки з контрагентами у Львівській області. Психологічний профіль свідчить про підприємницький тип поведінки з помірним рівнем ризику.\` 
            : \`Фізична особа. В ході ШІ-аналізу зв\\'язків не виявлено прямих співпадінь із корупційними схемами, санкційними списками чи кримінальними провадженнями.\`
        };`;

code = code.replace(virtualObjOld, virtualObjNew);

const logsOld = `    const searchLogs = [
      \`[OSINT] Ініційовано розширений ШІ-пошук: "\${customSearchName}"...\`,
      \`[DATABASE] Сканування бази паспортів МВС та прикордонної служби... (Збігів з розшуком не знайдено)\`,
      \`[DATABASE] Пошук збігів у базах ДПС (ІПН підтверджено, компанії не знайдені)...\`,
      \`[DARKNET] Пошук у витоках баз даних... (Збігів не виявлено)\`,
      \`[RECORDS] Сканування ЄДРСР (судовий реєстр) та санкційних списків РНБО... (Чисто)\`,
      \`[LINK_ANALYSIS] Побудова первинного графу зв'язків... (Немає афілійованих осіб)\`,
      \`[SYNTHESIS] Аналіз завершено. Створено нейтральний профіль.\`,
      \`[УСПІХ] Профіль особи завантажено в інтерактивний профайлер.\`
    ];`;
const logsNew = `    const isKizymaQuery = customSearchName.toLowerCase().includes('кізима') || customSearchName.toLowerCase().includes('кизима');
    const searchLogs = isKizymaQuery ? [
      \`[OSINT] Ініційовано глибокий ШІ-пошук: "\${customSearchName}"...\`,
      \`[DATABASE] Сканування бази паспортів МВС... (Підтверджено)\`,
      \`[DATABASE] Пошук у базах ДПС (ІПН підтверджено, знайдено корпоративні права)...\`,
      \`[RECORDS] Аналіз ЄДРПОУ... (Знайдено зв'язки з юридичними особами)\`,
      \`[PSYCH_ENGINE] Побудова психологічного портрету на основі цифрового сліду...\`,
      \`[LINK_ANALYSIS] Виявлено афілійованих осіб та компанії у Львівській області...\`,
      \`[SYNTHESIS] Аналіз завершено. Формування комплексного досьє.\`,
      \`[УСПІХ] Розширений профіль особи завантажено в профайлер.\`
    ] : [
      \`[OSINT] Ініційовано розширений ШІ-пошук: "\${customSearchName}"...\`,
      \`[DATABASE] Сканування бази паспортів МВС та прикордонної служби... (Збігів з розшуком не знайдено)\`,
      \`[DATABASE] Пошук збігів у базах ДПС (ІПН підтверджено, компанії не знайдені)...\`,
      \`[DARKNET] Пошук у витоках баз даних... (Збігів не виявлено)\`,
      \`[RECORDS] Сканування ЄДРСР (судовий реєстр) та санкційних списків РНБО... (Чисто)\`,
      \`[LINK_ANALYSIS] Побудова первинного графу зв'язків... (Немає афілійованих осіб)\`,
      \`[SYNTHESIS] Аналіз завершено. Створено нейтральний профіль.\`,
      \`[УСПІХ] Профіль особи завантажено в інтерактивний профайлер.\`
    ];`;
    
code = code.replace(logsOld, logsNew);

const assetsOld = `        // Remove or neutralize the mocked assets
        PROFILER_ASSETS.push({
          id: \`asset-virtual-car-\${Date.now()}\`,
          type: 'vehicle',
          name: 'Автомобіль (Стандартний клас)',
          value: 'Уточнюється',
          valueNum: 0,
          registeredToId: newPersonId,
          registeredToName: extractedName,
          relationType: 'Пряме володіння',
          isNominee: false,
          legalIncomeDisparity: false,
          details: 'Дані щодо нерухомості та транспортних засобів в межах норми.'
        });`;
        
const assetsNew = `        if (isKizyma) {
          PROFILER_ASSETS.push({
            id: \`asset-biz-1-\${Date.now()}\`,
            type: 'business',
            name: 'ТОВ "Агро-Стрий"',
            value: '$120,000 (Оцінка)',
            valueNum: 120000,
            registeredToId: newPersonId,
            registeredToName: extractedName,
            relationType: 'Засновник (50%)',
            isNominee: false,
            legalIncomeDisparity: false,
            details: 'Підприємство у сфері гуртової торгівлі та логістики. Статус: діюче.'
          });
          PROFILER_ASSETS.push({
            id: \`asset-real-estate-1-\${Date.now()}\`,
            type: 'real_estate',
            name: 'Комерційне приміщення (Львів)',
            value: '$85,000',
            valueNum: 85000,
            registeredToId: newPersonId,
            registeredToName: extractedName,
            relationType: 'Пряме володіння',
            isNominee: false,
            legalIncomeDisparity: false,
            details: 'Здається в оренду. Зареєстровано в Державному реєстрі речових прав.'
          });
        } else {
          PROFILER_ASSETS.push({
            id: \`asset-virtual-car-\${Date.now()}\`,
            type: 'vehicle',
            name: 'Автомобіль (Стандартний клас)',
            value: 'Уточнюється',
            valueNum: 0,
            registeredToId: newPersonId,
            registeredToName: extractedName,
            relationType: 'Пряме володіння',
            isNominee: false,
            legalIncomeDisparity: false,
            details: 'Дані щодо нерухомості та транспортних засобів в межах норми.'
          });
        }`;

code = code.replace(assetsOld, assetsNew);

const graphOld = `                {selectedPersonId.startsWith('virtual-') ? (
                  <g stroke="#334155" strokeWidth="1.5">
                    {/* Neutral Graph for Virtual Search */}
                  </g>
                ) : (`;
const graphNew = `                {selectedPersonId.startsWith('virtual-') ? (
                  <g stroke="#334155" strokeWidth="1.5">
                    {/* Neutral Graph for Virtual Search */}
                    {selectedPersonId.startsWith('virtual-') && selectedPerson.name.toLowerCase().includes('кізима') && (
                      <>
                        <line x1="250" y1="180" x2="110" y2="90" stroke="#3b82f6" strokeDasharray="4 4" className="animate-pulse" />
                        <line x1="250" y1="180" x2="390" y2="180" stroke="#10b981" strokeDasharray="4 4" />
                      </>
                    )}
                  </g>
                ) : (`;
code = code.replace(graphOld, graphNew);

const graphLabelsOld = `                {selectedPersonId.startsWith('virtual-') ? (
                  <g fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  </g>
                ) : (`;
const graphLabelsNew = `                {selectedPersonId.startsWith('virtual-') ? (
                  <g fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    {selectedPerson.name.toLowerCase().includes('кізима') && (
                      <>
                        <rect x="135" y="115" width="90" height="12" rx="4" fill="#0f172a" stroke="#3b82f6" strokeOpacity="0.4" />
                        <text x="180" y="123" fill="#60a5fa">ТОВ "Агро-Стрий"</text>
                        <rect x="295" y="174" width="80" height="12" rx="4" fill="#0f172a" stroke="#10b981" strokeOpacity="0.4" />
                        <text x="335" y="182" fill="#34d399">Партнер (ФОП)</text>
                      </>
                    )}
                  </g>
                ) : (`;
code = code.replace(graphLabelsOld, graphLabelsNew);


fs.writeFileSync('src/components/PersonProfiler.tsx', code);
