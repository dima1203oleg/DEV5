#!/bin/bash
sed -i '312i\
  const groupedLogs = filteredAnalysisLogs.reduce((acc, log) => {\
    const dateKey = log.date || new Date().toLocaleDateString();\
    if (!acc[dateKey]) acc[dateKey] = [];\
    acc[dateKey].push(log);\
    return acc;\
  }, {} as Record<string, AnalysisLog[]>);\
' src/components/MediaForensicsTab.tsx
