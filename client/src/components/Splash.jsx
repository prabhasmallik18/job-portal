import React from 'react'

const Splash = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(45deg, #ff0000, #00ffff, #0000ff, #00ff00, #ffff00, #ff00ff, #ff8000)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 3s ease infinite',
      perspective: '1000px',
      overflow: 'hidden'
    }}>
      <div style={{
        fontSize: '5rem',
        fontWeight: 'bold',
        color: 'white',
        textShadow: `
          0 0 10px #fff,
          0 0 20px #fff,
          0 0 30px #fff,
          0 0 40px #ff0000,
          0 0 70px #ff0000,
          0 0 80px #ff0000,
          0 0 100px #ff0000,
          0 0 150px #ff0000
        `,
        transform: 'rotateX(15deg) rotateY(-15deg)',
        transformStyle: 'preserve-3d',
        animation: 'float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate',
        position: 'relative'
      }}>
        Job Portal
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 30%, transparent 70%)',
          animation: 'sparkle 1s ease-in-out infinite'
        }}></div>
      </div>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: rotateX(15deg) rotateY(-15deg) translateY(0px); }
          50% { transform: rotateX(15deg) rotateY(-15deg) translateY(-20px); }
        }
        @keyframes glow {
          from { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff0000, 0 0 70px #ff0000, 0 0 80px #ff0000, 0 0 100px #ff0000, 0 0 150px #ff0000; }
          to { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00ffff, 0 0 70px #00ffff, 0 0 80px #00ffff, 0 0 100px #00ffff, 0 0 150px #00ffff; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  )
}

export default Splash