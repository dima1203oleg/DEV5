const fs = require('fs');

// AdminBackOffice
let content = fs.readFileSync('src/components/AdminBackOffice.tsx', 'utf8');
content = content.replace(/>Super Admin</g, '>Супер-адміністратор<');
content = content.replace(/>Admin</g, '>Адміністратор<');
content = content.replace(/>Auditor</g, '>Аудитор<');
content = content.replace(/>Operator</g, '>Оператор<');
content = content.replace(/>Analyst</g, '>Аналітик<');
content = content.replace(/>Guest</g, '>Гість<');
fs.writeFileSync('src/components/AdminBackOffice.tsx', content);

// DashboardView
content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');
content = content.replace(/>Forecast</g, '>Прогноз<');
content = content.replace(/>Zoom Out</g, '>Зменшити масштаб<');
content = content.replace(/>Download CSV</g, '>Завантажити CSV<');
fs.writeFileSync('src/components/DashboardView.tsx', content);

// AuthStatus
content = fs.readFileSync('src/components/AuthStatus.tsx', 'utf8');
content = content.replace(/>Identify</g, '>Ідентифікація<');
fs.writeFileSync('src/components/AuthStatus.tsx', content);

console.log('Translated additional components');
