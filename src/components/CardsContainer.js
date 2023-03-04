import React, { useState } from "react";
import Card1 from "../assets/1.png";
import Card2 from "../assets/2.png";
import Card3 from "../assets/3.png";
import Card4 from "../assets/4.png";
import Card5 from "../assets/5.png";
import Card6 from "../assets/6.png";
import Card7 from "../assets/7.png";
import Card8 from "../assets/8.png";
import Hand from "../assets/hand.jpg";
import "../App.css";

function CardsContainer() {
  const originalCards = [
    { name: "Card1", image: Card1 },
    { name: "Card2", image: Card2 },
    { name: "Card3", image: Card3 },
    { name: "Card4", image: Card4 },
    { name: "Card5", image: Card5 },
    { name: "Card6", image: Card6 },
    { name: "Card7", image: Card7 },
    { name: "Card8", image: Card8 },
  ];

  const duplicatedCards = shuffleArray([...originalCards, ...originalCards]);
  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  return (
    <div className="cards-container">
      {duplicatedCards.map((oneCard, index) => (
        <div className="flip-card" key={index}>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={Hand} alt="Card" id="backcard" />
            </div>
            <div className="flip-card-back">
              <img src={oneCard.image} alt={oneCard.name} id="backcard" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardsContainer;
