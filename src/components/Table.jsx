import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Table({ columns, data, keyField = 'id', getRowClassName, getRowStyle }) {
  const { t, tStatus, language } = useLanguage();
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      {/* Mobile Card List View (< md screens) */}
      <div className="md:hidden space-y-3">
        {data.length > 0 ? (
          data.map((row, rIdx) => (
            <div 
              key={row[keyField] || rIdx}
              className="p-4 bg-[#F8F7F4] border border-[#C4BEB3]/40 rounded-xl space-y-2 text-xs font-body shadow-xs"
            >
              {columns.map((col, cIdx) => {
                const headerRaw = typeof col.header === 'string' ? col.header : '';
                const isActions = headerRaw.toLowerCase().includes('action') || headerRaw.toLowerCase().includes('actie');
                const cellContent = col.render ? col.render(row) : row[col.accessor];
                const headerText = typeof col.header === 'string' ? tStatus(col.header) : col.header;

                if (isActions) {
                  return (
                    <div key={cIdx} className="pt-2 mt-2 border-t border-[#C4BEB3]/30 flex flex-wrap items-center justify-end gap-2">
                      {cellContent}
                    </div>
                  );
                }

                return (
                  <div key={cIdx} className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dark/50 flex-shrink-0">
                      {headerText}
                    </span>
                    <div className="text-right font-medium text-dark/90 min-w-0 truncate">
                      {cellContent}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs font-body text-dark/40 rounded-xl border border-[#C4BEB3]/35 bg-[#F8F7F4]">
            {language === 'NL' ? 'Geen gegevens beschikbaar' : 'No data available'}
          </div>
        )}
      </div>

      {/* Desktop Table View (>= md screens) */}
      <div ref={scrollRef} className="hidden md:block overflow-x-auto rounded-xl p-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C4BEB3 #F8F7F4' }}>
        <table className="w-full border-separate" style={{ borderSpacing: '0 8px', minWidth: '800px' }}>
          <thead>
            <tr>
              {columns.map((col, index) => {
                const headerText = typeof col.header === 'string' ? tStatus(col.header) : col.header;
                return (
                  <th
                    key={index}
                    scope="col"
                    className={`px-6 py-2 text-left text-[10px] font-bold font-body uppercase tracking-wider text-dark/50 ${col.className || ''}`}
                    style={col.style}
                  >
                    {headerText}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rIdx) => {
                const rowClass = getRowClassName ? getRowClassName(row, rIdx) : '';
                const rowStyle = getRowStyle ? getRowStyle(row, rIdx) : {};
                return (
                  <tr
                    key={row[keyField] || rIdx}
                    className={`transition-colors duration-200 group cursor-pointer ${rowClass}`}
                    style={{ position: 'relative', ...rowStyle }}
                  >
                  {columns.map((col, index) => (
                    <td 
                      key={index} 
                      className={`px-6 py-3.5 text-xs font-body text-dark/80 first:rounded-l-xl last:rounded-r-xl border-t border-b border-[#C4BEB3]/30 first:border-l last:border-r transition-colors duration-300 group-hover:bg-[#EDE8DF]/50 ${col.className || ''}`}
                      style={{ background: '#F8F7F4', whiteSpace: 'nowrap', ...col.style }}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-12 text-center text-xs font-body text-dark/40 rounded-xl border border-[#C4BEB3]/35" 
                  style={{ background: '#F8F7F4' }}
                >
                  {language === 'NL' ? 'Geen gegevens beschikbaar' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
