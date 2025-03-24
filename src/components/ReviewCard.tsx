import React, { useEffect, useState } from 'react'
import { Card } from '../interfaces/card';
import '../styles/ReviewCards.css';
import '../App.css';

interface ReviewCardsProps {
    cards: Card[]
}

const ReviewCards: React.FC<ReviewCardsProps> =  ( props ) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [isFrontVisible, setIsFrontVisible] = useState(true);
    const [activeCard, setActiveCard] = useState<number>(0);

    const toggleCard = () => {
        setIsFrontVisible(!isFrontVisible);
    };

    const nextCard = () => {
        if(activeCard+1 === cards.length) return;
        setActiveCard(activeCard+1);
        setIsFrontVisible(true);
    };

    const prevCard = () => {
        if(activeCard === 0) return;
        setActiveCard(activeCard-1);
        setIsFrontVisible(true);
    };

    useEffect(() => {
        setCards(props.cards);
    }, [props.cards]);

    return (
        <div>
            <h2>Review</h2>
            {cards[activeCard] ?(
                <>
                    <div key={cards[activeCard]?.id} onClick={toggleCard} >
                        { isFrontVisible ? (
                            <div className='card card_front'>{cards[activeCard].front}</div>
                        ) : (
                            <div className='card card_back'>{cards[activeCard].back}</div>
                        )}
                    </div>
                    <button className='card_button' onClick={prevCard}>Anterior</button>
                    <button className='card_button' onClick={nextCard}>Próxima</button>
                </>
            ):(<></>)}
        </div>
    )
}

export default ReviewCards
