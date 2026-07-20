export default function Table({ columns, data, keyField = 'id' }) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid #D9D2C7' }}>
      <table className="min-w-full divide-y" style={{ borderColor: '#D9D2C7' }}>
        <thead style={{ background: '#EDE8DF' }}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-5 py-3 text-left text-[11px] font-semibold font-body uppercase tracking-widest"
                style={{ color: '#4A4A43', opacity: 0.6 }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ background: '#F2EDE4', borderColor: '#D9D2C7' }}>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row[keyField]}
                className="transition-colors"
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#EDE8DF'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {columns.map((col, index) => (
                  <td key={index} className="px-5 py-3.5 text-sm font-body" style={{ color: '#4A4A43', whiteSpace: 'nowrap' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-14 text-center text-sm font-body" style={{ color: '#4A4A43', opacity: 0.4 }}>
                Geen gegevens beschikbaar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
