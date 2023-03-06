import "./App.css";
import { collection, getDocs, orderBy, limit } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import SingleCard from "./components/SingleCard";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import { db } from "./config/FirebaseConfig.js";
import Card1 from "./assets/1.png";
import Card2 from "./assets/2.png";
import Card3 from "./assets/3.png";
import Card4 from "./assets/4.png";
import Card5 from "./assets/5.png";
import Card6 from "./assets/6.png";
import Card7 from "./assets/7.png";
import Card8 from "./assets/8.png";
import Hand from "./assets/hand.jpg";

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
  const [score, setScore] = useState(null);
  const [gameEnd, setGameEnd] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    getHighScores();
  }, []);

  const shuffleCards = () => {
    const shuffledCards = [...originalCards, ...originalCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setStartTime(Date.now());
    setEndTime(false);
    setPassedTime(0);
    setGameEnd(null);
    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        setPassedTime((prevPassedTime) => prevPassedTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime]);

  //end game
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.match)) {
      setEndTime(Date.now());
      setGameEnd(true);
      handleShowModal();
      console.log("gameEnd :>> ", gameEnd);
      setScore(Math.floor(10000 / (turns + passedTime)));
    }
    console.log("gameEnd", gameEnd);
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

  //get highscores
  const getHighScores = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "scores"),
        orderBy("score", "asc"),
        limit(10)
      );
      const highScores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        player: doc.data().player,
        score: doc.data().score,
      }));
      setHighScores(highScores);
      console.log("highscores", highScores);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>Mystic Cards Memory Game</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="high-scores">
        {highScores.map((score) => (
          <p key={score.id}>
            {score.player} - {score.score} &nbsp;| &nbsp;
          </p>
        ))}
      </div>
      <div className="turns-and-counter">
        <p id="turns">Turns: {turns}</p>
        <p id="counter">Counter: {passedTime} sec</p>
      </div>

      {!startTime ? (
        <div className="landing-card">
          <img src={Hand} alt="Hand Card" id="hand-image" />
        </div>
      ) : (
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
      )}

      <Modal show={showModal} className="modal">
        <Modal.Body>
          <p>
            Congratulations!
            <br></br>You have finished the game in {passedTime} seconds and{" "}
            {turns} turns.<br></br>Your score is {score}.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="modal-button"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <footer className="footer fixed-bottom">
        <p>
          Mystic Cards Memory Game ® 2023 - by{" "}
          <a href="https://github.com/canyapalak" target="_blank">
            Can Yapalak
          </a>{" "}
          | Illustrations by
          <a
            href="https://www.freepik.com/author/pikisuperstar"
            target="_blank"
          >
            {" "}
            pikisuperstar
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
