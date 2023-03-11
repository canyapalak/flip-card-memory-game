import "./App.css";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  doc,
  setDoc,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import SingleCard from "./components/SingleCard";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { db } from "./config/FirebaseConfig.js";
import Card1 from "./assets/1.png";
import Card2 from "./assets/2.png";
import Card3 from "./assets/3.png";
import Card4 from "./assets/4.png";
import Card5 from "./assets/5.png";
import Card6 from "./assets/6.png";
import Card7 from "./assets/7.png";
import Card8 from "./assets/8.png";
import Card9 from "./assets/9.png";
import Card10 from "./assets/10.png";
import Hand from "./assets/hand.jpg";

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [passedTime, setPassedTime] = useState(0);
  const [score, setScore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [highScores, setHighScores] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showStartModal, setShowStartModal] = useState(false);
  const handleCloseStartModal = () => setShowStartModal(false);
  const handleShowStartModal = () => setShowStartModal(true);
  const [difficulty, setDifficulty] = useState("medium");

  const easyCards = [
    { name: "Card1", src: Card1, match: false },
    { name: "Card2", src: Card2, match: false },
    { name: "Card3", src: Card3, match: false },
    { name: "Card5", src: Card5, match: false },
    { name: "Card6", src: Card6, match: false },
    { name: "Card8", src: Card8, match: false },
  ];

  const mediumCards = [
    { name: "Card1", src: Card1, match: false },
    { name: "Card2", src: Card2, match: false },
    { name: "Card3", src: Card3, match: false },
    { name: "Card4", src: Card4, match: false },
    { name: "Card5", src: Card5, match: false },
    { name: "Card6", src: Card6, match: false },
    { name: "Card7", src: Card7, match: false },
    { name: "Card8", src: Card8, match: false },
  ];

  const hardCards = [
    { name: "Card1", src: Card1, match: false },
    { name: "Card2", src: Card2, match: false },
    { name: "Card3", src: Card3, match: false },
    { name: "Card4", src: Card4, match: false },
    { name: "Card5", src: Card5, match: false },
    { name: "Card6", src: Card6, match: false },
    { name: "Card7", src: Card7, match: false },
    { name: "Card8", src: Card8, match: false },
    { name: "Card9", src: Card9, match: false },
    { name: "Card10", src: Card10, match: false },
  ];

  //duplicate & shuffle cards and start a game
  const shuffleCards = () => {
    let cardsToUse;
    if (difficulty === "easy") {
      cardsToUse = easyCards;
    } else if (difficulty === "medium") {
      cardsToUse = mediumCards;
    } else {
      cardsToUse = hardCards;
    }

    const shuffledCards = [...cardsToUse, ...cardsToUse]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setStartTime(Date.now());
    setEndTime(false);
    setPassedTime(0);
    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setTurns(0);
    setInputValue("");
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
    let startingPoint;
    if (difficulty === "easy") {
      startingPoint = 6000;
    } else if (difficulty === "medium") {
      startingPoint = 10000;
    } else {
      startingPoint = 14000;
    }

    if (cards.length > 0 && cards.every((card) => card.match)) {
      handleShowModal();
      setEndTime(Date.now());
      const randomValue = Math.round(Math.random());
      setScore(Math.floor(startingPoint / (turns + passedTime) + randomValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, passedTime, turns]);

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

  //reset choices and increment turn
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  //get highscores
  useEffect(() => {
    console.log("Enjoy the game!");
    const getHighScores = async () => {
      try {
        const q = query(
          collection(db, "scores"),
          orderBy("score", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const highScores = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          player: doc.data().player,
          score: doc.data().score,
        }));
        setHighScores(highScores);
      } catch (error) {}
    };
    getHighScores();
  }, [showModal]);

  //save a score

  const saveScore = async () => {
    try {
      const scoreRef = doc(collection(db, "scores"));
      await setDoc(scoreRef, {
        player: inputValue,
        score: score,
      });
    } catch (error) {}
  };

  //handles

  const handleInputChange = (event) => {
    setInputValue(event.target.value.toLowerCase());
  };

  function saveScoreAndCloseModal() {
    saveScore();
    handleCloseModal();
  }

  function closeModalandStartGame() {
    handleCloseStartModal();
    shuffleCards();
  }

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  return (
    <div className="App">
      <h1>Mystic Cards Memory Game</h1>
      <button onClick={handleShowStartModal} id="game-button">
        New Game
      </button>
      <Modal show={showStartModal}>
        <Modal.Header closeButton onClick={handleCloseStartModal}>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please select a difficulty: </p>
          <Form.Select
            value={difficulty}
            aria-label="Default select example"
            onChange={handleDifficultyChange}
          >
            <option value="easy">Easy</option>
            <option value="medium" defaultValue={true}>
              Medium
            </option>
            <option value="hard">Hard</option>
          </Form.Select>
          <p id="minimum">*The harder the game, the higher scores you get.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            id="game-button"
            onClick={closeModalandStartGame}
          >
            Start
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="high-scores">
        {highScores.map((score, index) => (
          <span key={score.id}>
            <p>
              {score.player} - {score.score}
              {index !== highScores.length - 1 && <>&nbsp;|&nbsp;</>}
            </p>
          </span>
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
      <Modal show={showModal}>
        <Modal.Header closeButton onClick={handleCloseModal}>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Congratulations! You have finished the game in {passedTime} seconds
            and {turns} turns. Your score is {score}.{" "}
          </p>
          <p>Enter your name to save your score:</p>
          <input
            type="text"
            id="player-input"
            onChange={handleInputChange}
          ></input>
          <p id="minimum">*Between 3 and 10 characters</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            id="game-button"
            value={inputValue}
            onClick={saveScoreAndCloseModal}
            disabled={inputValue.length < 3 || inputValue.length > 10}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <footer className="footer fixed-bottom">
        <p>
          Mystic Cards Memory Game ® 2023 - by{" "}
          <a
            href="https://github.com/canyapalak"
            target="_blank"
            rel="noreferrer"
          >
            Can Yapalak
          </a>{" "}
          | Illustrations by
          <a
            href="https://www.freepik.com/author/pikisuperstar"
            target="_blank"
            rel="noreferrer"
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
