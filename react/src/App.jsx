import { useState, useRef } from 'react'
import FloorPlan from './FloorPlan.jsx'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const codeRef = useRef('')

  // Refs to functions provided by FloorPlan
  const addRef = useRef(() => {})
  const resetRef = useRef(() => {})

  const handleLogin = () => {
    if (codeRef.current.trim() === 'UTN2026') {
      setLoggedIn(true)
    } else {
      alert('Código incorrecto')
    }
  }

  const sidebarButtons = [
    { label: 'Añadir mesa', type: 'mesa' },
    { label: 'Añadir banco', type: 'banco' },
    { label: 'Añadir pizarrón', type: 'pizarron' },
    { label: 'Añadir panel eléctrico', type: 'panel' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 flex flex-col gap-2">
        <h2 className="text-xl font-semibold mb-4">Controles</h2>
        {sidebarButtons.map((b) => (
          <button
            key={b.type}
            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            onClick={() => addRef.current && addRef.current(b.type)}
          >
            {b.label}
          </button>
        ))}
        <button
          className="mt-4 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={() => resetRef.current && resetRef.current()}
        >
          Restablecer
        </button>
      </aside>

      {/* Main floor‑plan area */}
      <main className="flex-1 relative">
        <FloorPlan
          onAdd={(fn) => (addRef.current = fn)}
          onReset={(fn) => (resetRef.current = fn)}
        />
      </main>

      {/* Login modal */}
      {!loggedIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-2xl font-bold mb-4 text-center">Acceso al Taller</h2>
            <input
              type="password"
              placeholder="Código UTN2026"
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => (codeRef.current = e.target.value)}
            />
            <button
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              onClick={handleLogin}
            >
              Entrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
