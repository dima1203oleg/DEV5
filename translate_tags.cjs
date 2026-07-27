const fs = require('fs');

function replaceFile(path, pairs) {
  let content = fs.readFileSync(path, 'utf8');
  for (const [eng, ukr] of pairs) {
    content = content.split(eng).join(ukr);
  }
  fs.writeFileSync(path, content);
}

replaceFile('src/components/RiskAlertTicker.tsx', [
  ['>LIVE<', '>НАЖИВО<']
]);

replaceFile('src/components/ArchitectureTab.tsx', [
  ['>PIPELINE CORE<', '>ЯДРО КОНВЕЄРУ<'],
  ['>DATA STORAGE LAYER<', '>ШАР ЗБЕРІГАННЯ ДАНИХ<']
]);

replaceFile('src/components/PersonProfiler.tsx', [
  ['>PEP<', '>ПЕП<'],
  ['>WIFE<', '>ДРУЖИНА<'],
  ['>TEST<', '>ТЕСТ<'],
  ['>PROXY<', '>ПРОКСІ<'],
  ['>BRO<', '>БРАТ<']
]);

replaceFile('src/components/DataIngestionTab.tsx', [
  ['>CONFIDENCE<', '>ВІРОГІДНІСТЬ<'],
  ['>latency<', '>затримка<'],
  ['>default<', '>за замовчуванням<']
]);

replaceFile('src/components/SkeManifesto.tsx', [
  ['>latency<', '>затримка<']
]);

console.log('Translated specific tags');
