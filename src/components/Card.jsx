// Using explicit hex colors so Tailwind custom class issues don't affect rendering
export default function Card({ children, className = '', title, action, noPadding = false }) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: '#EDE8DF',
        border: '1px solid #C4BEB3',
        boxShadow: '0 2px 16px rgba(62,78,54,0.07)'
      }}
    >
      {(title || action) && (
        <div
          className="px-6 py-4 flex justify-between items-center"
          style={{ borderBottom: '1px solid #C4BEB3', background: '#EDE8DF' }}
        >
          {title && (
            <h3 className="font-heading font-semibold text-sm tracking-wide" style={{ color: '#3E4E36' }}>
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}
