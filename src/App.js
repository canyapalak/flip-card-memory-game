import "./App.css";
import React, { useEffect, useState } from "react";
import SingleCard from "./components/SingleCard";
import Card1 from "./assets/1.png";
import Card2 from "./assets/2.png";
import Card3 from "./assets/3.png";
import Card4 from "./assets/4.png";
import Card5 from "./assets/5.png";
import Card6 from "./assets/6.png";
import Card7 from "./assets/7.png";
import Card8 from "./assets/8.png";

function App() {
  const originalCards = [
    { name: "Card1", src: Card1, match: false },
    { name: "Card2", src: Card2, match: false },
    { name: "Card3", src: Card3, match: false },
    { name: "Card4", src: Card4, match: false },
    { name: "Card5", src: Card5, match: false },
    { name: "Card6", src: Card6, match: false },
    { name: "Card7", src: Card7, match: false },
    { name: "Card8", src: Card8, match: false },
  ];

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const shuffleCards = () => {
    const shuffledCards = [...originalCards, ...originalCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  //start a new game automarically
  useEffect(() => {
    shuffleCards();
  }, []);

  //handle a choice
  const handleChoice = (card) => {
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  //compare two cards
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.src === secondChoice.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === firstChoice.src) {
              return { ...card, match: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  console.log("cards", cards);

  //reset choices and increment turn
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  return (
    <div className="App">
      <h1>Mystic Cards Memory Game</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={
              card === firstChoice || card === secondChoice || card.match
            }
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
