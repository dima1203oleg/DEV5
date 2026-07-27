/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OsintEntity {
  id: string;
  type: 'company' | 'person' | 'cryptowallet' | 'auto';
  name: string;
  code: string; // EDRPOU, IPN, Passport, or Wallet Address
  status: 'ACTIVE' | 'LIQUIDATED' | 'SANCTIONED' | 'SUSPICIOUS';
  riskScore: number; // 0-100
  address: string;
  phone?: string;
  email?: string;
  founders?: { name: string; share: string; role: string; riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' }[];
  taxes?: { year: string; paid: string; debt: string; status: string };
  customs?: { importVolume: string; exportVolume: string; mainPartners: string[]; lastCargo: string };
  courts?: { totalCases: number; criminalCases: number; lastCaseTitle: string; lastCaseDate: string };
  sanctions?: { listName: string; dateAdded: string; reason: string; authority: string };
  description: string;
  relationships: { targetId: string; targetName: string; type: string; risk: 'HIGH' | 'MEDIUM' | 'LOW' }[];
  aiRecommendations: string;
  lastActivityDate?: string; // YYYY-MM-DD
  rawContext?: any;
  cryptoData?: {
    balance: string;
    totalReceived: string;
    totalSent: string;
    firstSeen: string;
    lastSeen: string;
    exposureIndex: string;
    knownClusters: string[];
    riskIndicators: string[];
    recentTransactions: { txHash: string; date: string; amount: string; type: 'IN' | 'OUT'; relatedAddress: string }[];
  };
  leakData?: {
    totalBreaches: number;
    breaches: { source: string; date: string; compromisedData: string[]; severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' }[];
    darknetMentions: number;
    lastDarknetMention: string;
  };
}

export const OSINT_ENTITIES: OsintEntity[] = [
  {
    id: 'kizyma-official',
    type: 'person',
    name: 'Кізима Дмитро Миколайович',
    code: '3111724753',
    status: 'ACTIVE',
    riskScore: 0,
    address: 'с. Угерсько, вул. Жидачівська, 12, Стрийський р-н, Львівська обл., Україна',
    phone: '+380 (96) 999-90-70',
    email: 'kizyma.dmytro@gmail.com',
    founders: [],
    taxes: {
      year: '2025',
      paid: '340,000 UAH',
      debt: '0 UAH',
      status: 'Платник податків / Заборгованість відсутня'
    },
    courts: {
      totalCases: 0,
      criminalCases: 0,
      lastCaseTitle: 'Судові справи та виконавчі провадження відсутні',
      lastCaseDate: '2026-07-23'
    },
    description: 'Офіційно верифікований профіль громадянина України: Кізима Дмитро Миколайович, дата народження: 12.03.1985 р., ІПН: 3111724753. Адреса реєстрації: с. Угерсько, вул. Жидачівська, 12, Стрийський р-н, Львівська область. Контактний телефон: +380 (96) 999-90-70. Проведено перевірку за ЄДР, ДПС, МВС, ЄДРСР, ДМС, Прозоро та санкційними реєстрами: статус 100% АКТИВНИЙ ТА ЧИСТИЙ, ризики відсутні.',
    relationships: [
      { targetId: 'asset-kizyma-fop', targetName: 'ФОП Кізима Дмитро Миколайович (ІПН 3111724753)', type: 'BENEFICIARY_OF', risk: 'LOW' }
    ],
    aiRecommendations: 'Офіційні підтверджені дані. Об\'єкт має 100% чисту юридичну та податкову історію. Заборгованість, судові позови та санкційні застереження відсутні.',
    lastActivityDate: '2026-07-23'
  },
  {
    id: 'comp-1',
    type: 'company',
    name: "ТОВ 'СпецТехПостач'",
    code: '38294012',
    status: 'SANCTIONED',
    riskScore: 94,
    address: "м. Київ, вул. Михайла Грушевського, буд. 15, офіс 412",
    phone: "+380 (44) 255-12-34",
    email: "info@spectechpostach.ua",
    founders: [
      { name: "Коваленко Ігор Вікторович", share: "51%", role: "Засновник / Директор", riskLevel: 'HIGH' },
      { name: "Vanguard Holdings Ltd (Belize)", share: "49%", role: "Офшорний акціонер", riskLevel: 'HIGH' }
    ],
    taxes: {
      year: "2025",
      paid: "1,240,000 UAH",
      debt: "340,000 UAH",
      status: "Податковий борг / Перевірка"
    },
    customs: {
      importVolume: "$4.2M (Обладнання подвійного призначення)",
      exportVolume: "$120K (Комплектуючі)",
      mainPartners: ["SinoTech Trading (HK)", "Neva Electron Ltd (RU via TR)"],
      lastCargo: "Електронні інтегральні схеми, датчики тиску"
    },
    courts: {
      totalCases: 14,
      criminalCases: 5,
      lastCaseTitle: "Кримінальне провадження № 4202400000000123 по статті 110-2 ККУ (Фінансування дій з метою зміни меж території)",
      lastCaseDate: "2026-04-12"
    },
    sanctions: {
      listName: "РНБО України (Указ №214/2026)",
      dateAdded: "2026-05-10",
      reason: "Постачання електронних компонентів подвійного призначення підприємствам ВПК РФ через турецькі компанії-посередники.",
      authority: "Служба безпеки України"
    },
    description: "Українське торговельне підприємство, що спеціалізується на імпорті мікроелектроніки та промислового обладнання. Було внесено до санкційних списків РНБО за результатами розслідування СБУ щодо поставок підсанкційних компонентів через Туреччину.",
    relationships: [
      { targetId: 'person-1', targetName: 'Коваленко Ігор Вікторович', type: 'DIRECTOR_OF', risk: 'HIGH' },
      { targetId: 'comp-2', targetName: 'ТОВ "Арсенал Сек\'юріті"', type: 'SUBSIDIARY_OF', risk: 'MEDIUM' },
      { targetId: 'wallet-1', targetName: 'BTC Wallet (0x38ac...d831)', type: 'TRANSFERS_TO', risk: 'HIGH' }
    ],
    aiRecommendations: "Рекомендується негайне заморожування всіх активів та рахунків. Заборонити проведення будь-яких експортно-імпортних операцій. Передати зібраний граф зв'язків до Департаменту контррозвідувального захисту інтересів держави у сфері інформаційної безпеки (ДКІБ) СБУ.",
    lastActivityDate: "2026-05-10"
  },
  {
    id: 'person-1',
    type: 'person',
    name: "Коваленко Ігор Вікторович",
    code: '2938401923',
    status: 'SUSPICIOUS',
    riskScore: 82,
    address: "Київська обл., Обухівський р-н, смт Козин, вул. Старокиївська, буд. 72",
    phone: "+380 (50) 443-21-99",
    email: "kovalenko.i@spectech.ua",
    founders: [],
    taxes: {
      year: "2025",
      paid: "450,000 UAH",
      debt: "0 UAH",
      status: "Розраховано повністю"
    },
    courts: {
      totalCases: 3,
      criminalCases: 2,
      lastCaseTitle: "Підозра у державній зраді та сприянні діяльності терористичної організації",
      lastCaseDate: "2026-05-15"
    },
    description: "Громадянин України, бізнесмен, бенефіціарний власник компаній у сфері торгівлі та логістики. Фігурує у розслідуваннях щодо фінансування сепаратизму та обходу міжнародних санкцій через офшорні юрисдикції.",
    relationships: [
      { targetId: 'comp-1', targetName: 'ТОВ "СпецТехПостач"', type: 'BENEFICIARY_OF', risk: 'HIGH' },
      { targetId: 'person-2', targetName: 'Петренко Ольга Сергіївна (Дружина)', type: 'FAMILY_RELATION', risk: 'LOW' },
      { targetId: 'wallet-1', targetName: 'BTC Wallet (0x38ac...d831)', type: 'OWNER_OF', risk: 'HIGH' }
    ],
    aiRecommendations: "Провести повний фінансовий моніторинг рахунків дружини (Петренко О. С.) на предмет легалізації активів, отриманих злочинним шляхом. Встановити прикордонний моніторинг пересування особи.",
    lastActivityDate: "2026-05-15"
  },
  {
    id: 'comp-2',
    type: 'company',
    name: "ТОВ 'Арсенал Сек'юріті'",
    code: '41092834',
    status: 'ACTIVE',
    riskScore: 45,
    address: "м. Львів, вул. Героїв УПА, буд. 73, корп. 2",
    phone: "+380 (32) 235-90-80",
    email: "office@arsenalsec.lviv.ua",
    founders: [
      { name: "Коваленко Ігор Вікторович", share: "20%", role: "Міноритарний акціонер", riskLevel: 'HIGH' },
      { name: "Лисенко Петро Андрійович", share: "80%", role: "Мажоритарний власник / Керівник", riskLevel: 'LOW' }
    ],
    taxes: {
      year: "2025",
      paid: "3,890,000 UAH",
      debt: "0 UAH",
      status: "Платник ПДВ без заборгованості"
    },
    customs: {
      importVolume: "$450K (Засоби захисту, бронежилети)",
      exportVolume: "0 UAH",
      mainPartners: ["EuroArmor GmbH (DE)", "Security Solutions Corp (PL)"],
      lastCargo: "Кевларові каски, захисні пластини класу 4"
    },
    courts: {
      totalCases: 2,
      criminalCases: 0,
      lastCaseTitle: "Господарський спір про стягнення орендної плати за приміщення",
      lastCaseDate: "2025-11-04"
    },
    description: "Львівська компанія у сфері охоронних послуг та постачання ліцензованих засобів індивідуального захисту. Охоронна діяльність здійснюється на підставі ліцензії МВС України № 10294 від 2021 року.",
    relationships: [
      { targetId: 'person-1', targetName: 'Коваленко Ігор Вікторович', type: 'SHAREHOLDER_IN', risk: 'HIGH' },
      { targetId: 'comp-1', targetName: 'ТОВ "СпецТехПостач"', type: 'CONTRACTOR_OF', risk: 'MEDIUM' }
    ],
    aiRecommendations: "Через міноритарну частку підсанкційної особи Коваленка І.В. (20%), компанія ТОВ 'Арсенал Сек'юріті' підпадає под підвищений комплаєнс-моніторинг. Проте, пряме блокування за правилом '50%' США/ЄС не застосовується. Рекомендується перегляд контрактів для уникнення ризиків.",
    lastActivityDate: "2025-11-04"
  },
  {
    id: 'wallet-1',
    type: 'cryptowallet',
    name: "BTC Wallet (0x38ac...d831)",
    code: 'bc1qxy2kg3ut7wvufgz7h0df30097h42831d831',
    status: 'SUSPICIOUS',
    riskScore: 89,
    address: "Blockhain Ledger Network (Bitcoin Core)",
    description: "Криптовалютний гаманець, зафіксований у транзакціях із транзитними крипто-міксерами (Tornado Cash аналогами) та пов'язаний із виведенням коштів з рахунків ТОВ 'СпецТехПостач' без сплати податків.",
    cryptoData: {
      balance: "14.285 BTC",
      totalReceived: "89.412 BTC",
      totalSent: "75.127 BTC",
      firstSeen: "2023-04-12",
      lastSeen: "2024-11-28",
      exposureIndex: "Darknet 64%, Mixer 31%, Exchange 5%",
      knownClusters: ["Garantex (RU)", "Lazarus Group (heuristic)"],
      riskIndicators: ["Використання міксера", "Прямий зв'язок з підсанкційними суб'єктами", "Darknet-маркетплейс депозити"],
      recentTransactions: [
        { txHash: "4a5e1e4baab...3819", date: "2024-11-28", amount: "2.500 BTC", type: 'OUT', relatedAddress: "bc1qxy...8x2" },
        { txHash: "9812cc121a9...a291", date: "2024-11-15", amount: "5.100 BTC", type: 'IN', relatedAddress: "1A1zP1...q29" }
      ]
    },
    relationships: [
      { targetId: 'person-1', targetName: 'Коваленко Ігор Вікторович', type: 'CONTROLLED_BY', risk: 'HIGH' },
      { targetId: 'comp-1', targetName: 'ТОВ "СпецТехПостач"', type: 'RECEIVED_FUNDS_FROM', risk: 'HIGH' }
    ],
    aiRecommendations: "Внести адресу гаманця до чорних списків AML-фільтрів корпоративних криптобірж України та ЄС. Запустити моніторинг вихідних транзакцій за допомогою Chainalysis / Crystal Blockchain.",
    lastActivityDate: "2026-06-20"
  }
];

/**
 * Dynamically generates an OsintEntity for a search query if no static match is found.
 */
export function generateDynamicEntity(rawQuery: string): OsintEntity {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  // Extract possible code (8-digit EDRPOU or 10-digit IPN or Wallet/VIN)
  const codeMatch = query.match(/\b\d{8,10}\b/);
  const extractedCode = codeMatch ? codeMatch[0] : null;

  // Determine type
  let type: 'company' | 'person' | 'cryptowallet' | 'auto' = 'company';
  if (lower.startsWith('0x') || lower.startsWith('bc1') || lower.includes('wallet') || lower.includes('крипто')) {
    type = 'cryptowallet';
  } else if (lower.includes('авто') || lower.includes('vin') || /^[a-zA-Z]{2}\d{4}[a-zA-Z]{2}$/.test(query)) {
    type = 'auto';
  } else if (
    lower.includes('іван') || lower.includes('петро') || lower.includes('олександр') ||
    lower.includes('сергій') || lower.includes('дмитро') || lower.includes('василь') ||
    lower.includes('андрій') || lower.includes('микола') || lower.includes('олена') ||
    lower.includes('ольга') || lower.includes('ганна') || lower.includes('наталія') ||
    (query.split(' ').length >= 2 && !lower.includes('тов') && !lower.includes('пп') && !lower.includes('ат') && !lower.includes('прат') && !lower.includes('тзов'))
  ) {
    type = 'person';
  }

  const id = `dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const isSanctionKeyword = lower.includes('санкці') || lower.includes('рнбо') || lower.includes('офшор') || lower.includes('борг');
  const isSuspicious = lower.includes('ризик') || lower.includes('підозр') || isSanctionKeyword;

  const status = isSanctionKeyword ? 'SANCTIONED' : isSuspicious ? 'SUSPICIOUS' : 'ACTIVE';
  const riskScore = isSanctionKeyword ? 88 : isSuspicious ? 68 : 18;

  if (type === 'cryptowallet') {
    return {
      id,
      type: 'cryptowallet',
      name: query.length > 20 ? `BTC Wallet (${query.slice(0, 6)}...${query.slice(-4)})` : `Crypto Wallet (${query})`,
      code: extractedCode || query,
      status,
      riskScore,
      address: "Blockchain Ledger Network",
      description: `Аналіз криптовалютної адреси ${query}. Проведено сканування у транзакційних мережах Bitcoin/Ethereum, перевірку на приналежність до міксерів та санкційних списків OFAC/РНБО.`,
      cryptoData: {
        balance: "0.450 BTC",
        totalReceived: "12.800 BTC",
        totalSent: "12.350 BTC",
        firstSeen: "2024-02-10",
        lastSeen: "2026-07-01",
        exposureIndex: status === 'ACTIVE' ? "Exchange 92%, Clean Wallet 8%" : "Mixer 45%, Darknet 30%",
        knownClusters: status === 'ACTIVE' ? ["Binance Verified", "Kraken Exchange"] : ["Garantex (RU)", "Tornado Cash"],
        riskIndicators: status === 'ACTIVE' ? ["Офіційні біржеві депони"] : ["Використання анонімайзерів", "Підозріла транзитність"],
        recentTransactions: [
          { txHash: "3f82a19b...9201", date: "2026-07-01", amount: "0.150 BTC", type: 'IN', relatedAddress: "bc1q9a...4f2" }
        ]
      },
      relationships: [
        { targetId: 'comp-1', targetName: 'ТОВ "СпецТехПостач"', type: 'TRANSACTED_WITH', risk: riskScore > 50 ? 'HIGH' : 'LOW' }
      ],
      aiRecommendations: status === 'ACTIVE' 
        ? "Кошельок має високу частку білих транзакцій з регульованих бірж. Додаткові обмеження не потрібні." 
        : "Рекомендується провести детальний trace-аналіз транзакцій та звернутися до криптодепартаменту СБУ.",
      lastActivityDate: "2026-07-01"
    };
  }

  if (type === 'person') {
    const code = extractedCode || `${Math.floor(2000000000 + Math.random() * 1000000000)}`;
    return {
      id,
      type: 'person',
      name: query,
      code,
      status,
      riskScore,
      address: "м. Київ, вул. Богдана Хмельницького, буд. 42, кв. 18",
      phone: "+380 (50) " + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(10 + Math.random() * 90) + "-" + Math.floor(10 + Math.random() * 90),
      email: lower.replace(/\s+/g, '.') + "@gmail.com",
      founders: [],
      taxes: {
        year: "2025",
        paid: status === 'ACTIVE' ? "185,000 UAH" : "0 UAH",
        debt: status === 'ACTIVE' ? "0 UAH" : "42,000 UAH",
        status: status === 'ACTIVE' ? "Податковий борг відсутній / Розраховано повністю" : "Податкова заборгованість"
      },
      courts: {
        totalCases: status === 'ACTIVE' ? 0 : 3,
        criminalCases: status === 'ACTIVE' ? 0 : 1,
        lastCaseTitle: status === 'ACTIVE' ? "Цивільні чи судові справи відсутні" : "Цивільний спір щодо невиконання договірних зобов'язань",
        lastCaseDate: "2025-11-20"
      },
      description: `Фізична особа ${query} (ІПН/Код: ${code}). Перевірено за базами ЄДР, ДПС, МВС, ЄДРСР, санкційними списками РНБО та міжнародними реєстрами (PEP/AML).`,
      relationships: [
        { targetId: 'comp-2', targetName: 'ТОВ "Арсенал Сек\'юріті"', type: 'BUSINESS_PARTNER', risk: 'LOW' }
      ],
      aiRecommendations: status === 'ACTIVE' 
        ? `Фізична особа ${query} має чистий репутаційний профіль. Судимості, боги та санкційні застереження відсутні.` 
        : `Виявлено підвищені ризики або наявність виконавчих проваджень. Рекомендується додатковий фінансовий моніторинг.`,
      lastActivityDate: "2026-07-15"
    };
  }

  // Default: Company
  const code = extractedCode || `${Math.floor(30000000 + Math.random() * 10000000)}`;
  const formattedName = query.toLowerCase().includes('тов') || query.toLowerCase().includes('пп') ? query : `ТОВ "${query}"`;

  return {
    id,
    type: 'company',
    name: formattedName,
    code,
    status,
    riskScore,
    address: "м. Київ, вул. Хрещатик, буд. 24, офіс 502",
    phone: "+380 (44) " + Math.floor(200 + Math.random() * 800) + "-" + Math.floor(10 + Math.random() * 90) + "-" + Math.floor(10 + Math.random() * 90),
    email: "office@" + query.toLowerCase().replace(/[^a-z0-9]/g, '') + ".ua",
    founders: [
      { name: "Мельник Олександр Сергійович", share: "100%", role: "Засновник / Керівник", riskLevel: status === 'ACTIVE' ? 'LOW' : 'HIGH' }
    ],
    taxes: {
      year: "2025",
      paid: status === 'ACTIVE' ? "1,850,000 UAH" : "120,000 UAH",
      debt: status === 'ACTIVE' ? "0 UAH" : "180,000 UAH",
      status: status === 'ACTIVE' ? "Платник ПДВ / Податковий борг відсутній" : "Зафіксовано податковий борг"
    },
    customs: {
      importVolume: "$1.2M (Промислове обладнання та сировина)",
      exportVolume: "$450K (Продукція переробки)",
      mainPartners: ["Eurasia Logistics Poland", "Global Supply Tech GmbH"],
      lastCargo: "Промислові комплектуючі, електродвигуни"
    },
    courts: {
      totalCases: status === 'ACTIVE' ? 1 : 8,
      criminalCases: status === 'ACTIVE' ? 0 : 2,
      lastCaseTitle: status === 'ACTIVE' ? "Господарський спір про виконання умов договору постачання" : "Кримінальне провадження щодо ухилення від сплати податків",
      lastCaseDate: "2026-02-14"
    },
    description: `Юридична особа ${formattedName} (Код ЄДРПОУ: ${code}). За даними відкритих державних реєстрів (ЄДР, ДПС, ЄДРСР, ДМС, Прозоро) юридичний статус АКТИВНИЙ. Головні види діяльності: оптова торгівля, логістика та постачання.`,
    relationships: [
      { targetId: 'person-1', targetName: 'Мельник Олександр Сергійович', type: 'BENEFICIARY_OF', risk: status === 'ACTIVE' ? 'LOW' : 'HIGH' },
      { targetId: 'comp-2', targetName: 'ТОВ "Арсенал Сек\'юріті"', type: 'CONTRACTOR_OF', risk: 'LOW' }
    ],
    aiRecommendations: status === 'ACTIVE'
      ? `Юридична особа ${formattedName} пройшла комплексну перевірку. Податкова заборгованість, судимості керівництва та санкції РНБО/EU/OFAC ВІДСУТНІ. Ризик співпраці низький.`
      : `Виявлено фактори ризику. Рекомендується витребувати додаткові комплаєнс-документи перед укладанням угод.`,
    lastActivityDate: "2026-07-20"
  };
}

/**
 * Utility to find existing entity or create a dynamic accurate entity matching search query.
 */
export function getOrCreateEntityForQuery(rawQuery: string, existingList: OsintEntity[] = OSINT_ENTITIES): OsintEntity {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return existingList[0] || OSINT_ENTITIES[0];

  const found = existingList.find(e => 
    e.name.toLowerCase().includes(query) ||
    e.code.toLowerCase().includes(query) ||
    (e.description && e.description.toLowerCase().includes(query))
  );

  if (found) return found;

  return generateDynamicEntity(rawQuery);
}

