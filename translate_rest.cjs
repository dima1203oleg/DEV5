const fs = require('fs');

function translateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\[SUCCESS\]/g, "[УСПІХ]");
  content = content.replace(/ SUCCESS/g, " УСПІШНО");
  content = content.replace(/SUCCESS:/g, "УСПІШНО:");
  content = content.replace(/\[ERROR\]/g, "[ПОМИЛКА]");
  content = content.replace(/ ERROR /g, " ПОМИЛКА ");
  content = content.replace(/ERROR:/g, "ПОМИЛКА:");
  content = content.replace(/'Dashboard'/g, "'Дашборд'");
  content = content.replace(/"Dashboard"/g, '"Дашборд"');
  fs.writeFileSync(filePath, content);
}

translateFile('src/components/PersonProfiler.tsx');
translateFile('src/components/DataIngestionTab.tsx');
translateFile('src/components/AutonomousFactory.tsx');
console.log('Translated generic logs in additional files');
