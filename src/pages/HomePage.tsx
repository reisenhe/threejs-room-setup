import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#1565c0',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Clinic Monitor 3D
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#424242',
            maxWidth: '600px',
            lineHeight: 1.6,
          }}
        >
          一个交互式的3D诊所监控系统，提供沉浸式的医疗环境可视化和模型导出功能
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '900px',
        }}
      >
        <Link
          to="/clinic"
          style={{
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '2.5rem',
              width: '320px',
              boxShadow: '0 8px 32px rgba(21, 101, 192, 0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              border: '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(21, 101, 192, 0.25)'
              e.currentTarget.style.borderColor = '#1565c0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(21, 101, 192, 0.15)'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1565c0',
                marginBottom: '0.75rem',
              }}
            >
              3D 诊所场景
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: '#616161',
                lineHeight: 1.5,
              }}
            >
              进入交互式3D诊所环境，浏览候诊区、接待台等区域，支持自由视角导航
            </p>
          </div>
        </Link>

        <Link
          to="/export"
          style={{
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '2.5rem',
              width: '320px',
              boxShadow: '0 8px 32px rgba(21, 101, 192, 0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              border: '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(21, 101, 192, 0.25)'
              e.currentTarget.style.borderColor = '#1565c0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(21, 101, 192, 0.15)'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #00897b, #26a69a)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#00897b',
                marginBottom: '0.75rem',
              }}
            >
              模型导出工具
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: '#616161',
                lineHeight: 1.5,
              }}
            >
              导出3D诊所模型为多种格式，支持OBJ、GLTF等标准格式，便于在其他软件中使用
            </p>
          </div>
        </Link>
      </div>

      <footer
        style={{
          marginTop: '4rem',
          color: '#757575',
          fontSize: '0.875rem',
        }}
      >
        Clinic Monitor 3D &copy; 2026
      </footer>
    </div>
  )
}

export default HomePage
