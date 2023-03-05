import React from "react";
import "./SingleCard.css";
import CardBack from "../assets/hand.jpg";

export default function SingleCard({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img src={card.src} className="front" alt="Card Front" />
        <img
          src={CardBack}
          className="back"
          alt="Card Back"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
