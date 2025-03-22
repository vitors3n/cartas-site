import { useEffect, useState } from 'react'
import './App.css'

interface Card {
  id: number;
  front: string;
  back: string;
  reviews: number;
}

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if(activeCard === 0) return
    setActiveCard(activeCard-1);
    setIsFrontVisible(true);
  };

  useEffect(() => {

    fetch("http://localhost:8080/api/v1/card")
      .then((response) => {
        if(!response.ok){
          throw new Error("Falha ao pegar cartas");
        }
        return response.json();
      })
      .then((data) => {

        setCards(data.map((card: any) => ( {
          id: card.id,
          front: card.front,
          back: card.back,
          reviews: card.reviews 
        })));
        setActiveCard(0)

        setLoading(false);
      })
      .catch((err) =>{
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>

  return (
      <div>
        <h2>Review</h2>
          <div key={cards[activeCard].id} onClick={toggleCard} style={{ cursor: "pointer"}}>
            {isFrontVisible ? (
              <div className='card card_front'>{cards[activeCard].front}</div>
            ) : (
              <div className='card card_back'>{cards[activeCard].back}</div>
            )}
          </div>
          <button className='card_button' onClick={prevCard}>Anterior</button>
          <button className='card_button' onClick={nextCard}>Próxima</button>
      </div>
  )
}

export default App
