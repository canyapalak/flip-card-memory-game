import "./App.css";
import React, { useState } from "react";
import Card1 from "./assets/1.png";
import Card2 from "./assets/2.png";
import Card3 from "./assets/3.png";
import Card4 from "./assets/4.png";
import Card5 from "./assets/5.png";
import Card6 from "./assets/6.png";
import Card7 from "./assets/7.png";
import Card8 from "./assets/8.png";
import CardBack from "./assets/hand.jpg";

function App() {
  const originalCards = [
    { name: "Card1", src: Card1 },
    { name: "Card2", src: Card2 },
    { name: "Card3", src: Card3 },
    { name: "Card4", src: Card4 },
    { name: "Card5", src: Card5 },
    { name: "Card6", src: Card6 },
    { name: "Card7", src: Card7 },
    { name: "Card8", src: Card8 },
  ];

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);

  const shuffleCards = () => {
    const shuffledCards = [...originalCards, ...originalCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
  };

  console.log("shuffledCards :>> ", cards, turns);

  return (
    <div className="App">
      <h1>Mystic Cards Memory Game</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <div className="card" key={card.id}>
            <div>
              <img src={card.src} className="front" alt="Card Front" />
              <img src={CardBack} className="back" alt="Card Back" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
