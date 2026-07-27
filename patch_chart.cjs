const fs = require('fs');
let code = fs.readFileSync('src/components/PersonProfiler.tsx', 'utf8');

const oldChart = `  const wealthChartData = [
    { name: 'Офіційний дохід', сума: selectedPerson.id === 'kovalenko-ihor' ? 540000 : selectedPerson.id === 'petrenko-olha' ? 0 : 180000 },
    { name: 'Тіньові схеми', сума: selectedPerson.id === 'kovalenko-ihor' ? 8200000 : selectedPerson.id === 'petrenko-olha' ? 1400000 : 2400000 },
    { name: 'Закордонні рахунки', сума: selectedPerson.id === 'kovalenko-ihor' ? 12000000 : selectedPerson.id === 'petrenko-olha' ? 4200000 : 800000 }
  ];`;

const newChart = `  const isVirtualChart = selectedPerson.id.startsWith('virtual-');
  const wealthChartData = [
    { name: 'Офіційний дохід', сума: isVirtualChart ? 320000 : (selectedPerson.id === 'kovalenko-ihor' ? 540000 : selectedPerson.id === 'petrenko-olha' ? 0 : 180000) },
    { name: 'Тіньові схеми', сума: isVirtualChart ? 0 : (selectedPerson.id === 'kovalenko-ihor' ? 8200000 : selectedPerson.id === 'petrenko-olha' ? 1400000 : 2400000) },
    { name: 'Закордонні рахунки', сума: isVirtualChart ? 0 : (selectedPerson.id === 'kovalenko-ihor' ? 12000000 : selectedPerson.id === 'petrenko-olha' ? 4200000 : 800000) }
  ];`;

code = code.replace(oldChart, newChart);
fs.writeFileSync('src/components/PersonProfiler.tsx', code);
