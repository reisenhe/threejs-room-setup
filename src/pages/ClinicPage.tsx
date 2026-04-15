import { Link } from 'react-router-dom'
import ClinicScene from '../scene/ClinicScene'

function ClinicPage() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f0f2f5',
      }}
    >
      <ClinicScene />

      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          textDecoration: 'none',
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'background 0.2s ease, transform 0.2s ease',
            cursor: 'pointer',
            border: '1px solid rgba(21, 101, 192, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1565c0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span
            style={{
              color: '#1565c0',
              fontWeight: 600,
              fontSize: '0.95rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            返回首页
          </span>
        </div>
      </Link>
    </div>
  )
}

export default ClinicPage
