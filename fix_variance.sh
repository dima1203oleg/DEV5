sed -i '/{trendMetrics.isPositive ? '"'"'+'"'"' : '"'"''"'"'}{trendMetrics.percentChange}%/!b;n;a\
                </div>\
                {trendData.filter(d => d.isAnomaly).length > 0 && (\
                  <div className="mt-2 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 flex flex-col gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.1)]">\
                    <span className="font-bold flex items-center gap-1.5 uppercase tracking-wide text-xs">\
                      <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />\
                      Variance Warning\
                    </span>\
                    <span className="text-[10px] leading-relaxed text-rose-300/90">\
                      Anomalous log spikes detected at: {trendData.filter(d => d.isAnomaly).map(d => d.date).join('", "')}. Potential orchestrated deepfake campaign or systemic analysis anomaly.\
                    </span>\
                  </div>\
                )}' src/components/MediaForensicsTab.tsx
