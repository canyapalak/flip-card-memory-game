import "./App.css";
import React, { useEffect, useState } from "react";
import SingleCard from "./components/SingleCard";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [passedTime, setPassedTime] = useState(0);
  const [gameEnd, setGameEnd] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const duration = endTime ? Math.round((endTime - startTime) / 1000) : null;

  const shuffleCards = () => {
    const shuffledCards = [...originalCards, ...originalCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setStartTime(Date.now());
    setEndTime(null);
    setPassedTime(0);
    setGameEnd(false);
    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        setPassedTime((prevPassedTime) => prevPassedTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime]);

  // gameEnd ? handleShowModal(true) : handleShowModal(false);

  //end game
  useEffect(() => {
    if (cards.every((card) => card.match)) {
      setEndTime(Date.now());
      setGameEnd(true);
      handleShowModal(true);
    }
  }, [cards]);

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
      <div className="turns-and-counter">
        <p id="turns">Turns: {turns}</p>
        {/* <p>Duration: {duration !== null ? duration + " seconds" : "-"}</p> */}
        <p id="counter">Counter: {passedTime} sec</p>
      </div>
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
      <Modal show={showModal} className="signup-modal">
        <Modal.Body>
          <p>You have successfully uploaded your picture.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="signup-modal-button"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
