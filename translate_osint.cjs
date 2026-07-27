const fs = require('fs');
let content = fs.readFileSync('src/components/OsintWorkbench.tsx', 'utf8');

// Replace table headers
content = content.replace(/>Tx Hash</g, '>Хеш транзакції<');
content = content.replace(/>Date</g, '>Дата<');
content = content.replace(/>Type</g, '>Тип<');
content = content.replace(/>Amount</g, '>Сума<');
content = content.replace(/>Related Address</g, ">Пов'язана адреса<");

// Replace PDF Brief Preview
content = content.replace(/>PDF Brief Preview</g, '>Попередній перегляд PDF-звіту<');
content = content.replace(/>Review the intelligence report before final export</g, '>Перевірте звіт розвідки перед остаточним експортом<');

// Replace PDF Search Criteria
content = content.replace(/>Search Criteria</g, '>Критерії пошуку<');
content = content.replace(/>Risk Statistics</g, '>Статистика ризиків<');
content = content.replace(/>Data Table</g, '>Таблиця даних<');
content = content.replace(/>Graph Connections</g, ">Граф зв'язків<");
content = content.replace(/>QR Code Auth</g, '>QR-код автентифікації<');
content = content.replace(/>Network Graph Visualization Data</g, '>Дані візуалізації мережевого графа<');
content = content.replace(/>Verify Intelligence Brief</g, '>Перевірка розвідувального звіту<');
content = content.replace(/>Generate PDF Brief</g, '>Згенерувати PDF-звіт<');

// Replace connection status strings
content = content.replace(/>ONLINE</g, '>ОНЛАЙН<');
content = content.replace(/>AUTHORIZED</g, '>АВТОРИЗОВАНО<');
content = content.replace(/>INDEXED</g, '>ПРОІНДЕКСОВАНО<');
content = content.replace(/>Blockchain Analytics</g, '>Блокчейн-аналітика<');
content = content.replace(/>SATELLITE SYNC FEED ACTIVE</g, '>АКТИВНИЙ ПОТІК СУПУТНИКОВОЇ СИНХРОНІЗАЦІЇ<');

fs.writeFileSync('src/components/OsintWorkbench.tsx', content);
console.log('Translated OsintWorkbench');
