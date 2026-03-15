'use client'
import { useState, useEffect } from 'react'

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setShow(false), 600)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {show && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#0A0F0A',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 0.6s ease',
          opacity: fadeOut ? 0 : 1,
          pointerEvents: fadeOut ? 'none' : 'all',
        }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');
            @keyframes splashGrow {
              0% { transform: scale(0.5); opacity: 0; }
              60% { transform: scale(1.08); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes splashText {
              0% { opacity: 0; transform: translateY(16px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes splashBar {
              0% { width: 0%; }
              100% { width: 100%; }
            }
            @keyframes splashPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,135,0.4); }
              50% { box-shadow: 0 0 0 20px rgba(0,255,135,0); }
            }
            .splash-icon {
              animation: splashGrow 0.8s cubic-bezier(0.34,1.56,0.64,1) both, splashPulse 2s ease 0.8s infinite;
            }
            .splash-title {
              animation: splashText 0.6s ease 0.6s both;
            }
            .splash-sub {
              animation: splashText 0.6s ease 0.8s both;
            }
            .splash-bar-fill {
              animation: splashBar 1.8s ease-out 0.3s both;
            }
          `}</style>

          {/* Background glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,255,135,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />

          {/* Icon */}
          <div className="splash-icon" style={{
            width: 96, height: 96, borderRadius: 28,
            background: 'linear-gradient(135deg, rgba(0,255,135,0.15), rgba(0,212,255,0.1))',
            border: '1px solid rgba(0,255,135,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, marginBottom: 28,
            position: 'relative', zIndex: 1,
          }}>
            🌿
          </div>

          {/* Title */}
          <h1 className="splash-title" style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 36, fontWeight: 800,
            color: '#F0FFF4',
            letterSpacing: '-0.02em',
            marginBottom: 8,
            position: 'relative', zIndex: 1,
          }}>
            MyCropSage
          </h1>

          {/* Subtitle */}
          <p className="splash-sub" style={{
            fontSize: 14, color: 'rgba(240,255,244,0.5)',
            marginBottom: 48, letterSpacing: '0.05em',
            position: 'relative', zIndex: 1,
          }}>
            AI-Powered Farming Assistant
          </p>

          {/* Progress bar */}
          <div style={{
            width: 200, height: 2,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 100, overflow: 'hidden',
            position: 'relative', zIndex: 1,
          }}>
            <div className="splash-bar-fill" style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00FF87, #00D4FF)',
              borderRadius: 100,
            }} />
          </div>

          {/* Version */}
          <p style={{
            position: 'absolute', bottom: 32,
            fontSize: 11, color: 'rgba(240,255,244,0.2)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            MIT-WPU Hackathon 2026
          </p>
        </div>
      )}
      {children}
    </>
  )
}