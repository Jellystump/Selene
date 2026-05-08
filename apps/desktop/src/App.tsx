import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { getMoonPhase } from  "@selene/astronomy";
import { MoonImg } from "@selene/ui";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");


  const [phase, setPhase] = useState(0);

  async function updateMoon() {
    const currentPhase = getMoonPhase(new Date());
    setPhase(currentPhase);
  }
const isWaxing = phase < 180;
  
  const rotationY = phase;

  async function greet() {
    setGreetMsg(String(getMoonPhase(new Date(Date.now()))));
  }

  return (
    <main className="container">

      <div className="row">
      <div 
          className="moon-container" 
          style={{ '--moon-img': `url(${MoonImg.full})` } as any}
        >
          {/*  Luna Llena  */}
         <div className="discFull"></div>

          {/* Sombra Estática */}
          <div className="moon-half-shadow" style={{
            left: isWaxing ? 0 : '50%',
            opacity: (phase === 180) ? 0 : 1 // Desaparece en Luna Llena pura
          }} />

          {/* Disco Rotatorio */}
          <div className="disc" style={{ transform: `rotateY(${rotationY}deg)` }}>
          </div>
        </div>
      </div>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <button onClick={updateMoon}>Calcular Fase Actual</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
