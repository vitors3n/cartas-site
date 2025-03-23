import { useEffect, useState } from 'react'
import { Card } from './interfaces/card';
import './App.css'

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFrontVisible, setIsFrontVisible] = useState(true);
  const [activeCard, setActiveCard] = useState<number>(0);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

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

  const addCard = async () => {
    if (front && back) {
      try {
        const response = await fetch("http://localhost:8080/api/v1/card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ front, back, reviews:0 }),
        });
        if (!response.ok) {
          throw new Error("Falha ao adicionar carta");
        }
        window.location.reload();
      } catch (err) {
        console.error(err);
        setError("Falha ao adicionar carta");
      }
    }
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
    <div className='container'>
      <div>
        <h2>Review</h2>
          <div key={cards[activeCard].id} 
            onClick={toggleCard}
          >
            {isFrontVisible ? (
              <div className='card card_front'>{cards[activeCard].front}</div>
            ) : (
              <div className='card card_back'>{cards[activeCard].back}</div>
            )}
          </div>
          <button className='card_button' onClick={prevCard}>Anterior</button>
          <button className='card_button' onClick={nextCard}>Próxima</button>
      </div>
      <div>
        <h2>Nova Carta</h2>
        <div className='formNewCard'>
          <form onSubmit={(e) => { e.preventDefault(); }}>
          <textarea
            className='new_card_text'
            placeholder="Frente da carta"
            value={front}
            onChange={(e) => setFront(e.target.value)}
          />
          <br/>
          <textarea
            className='new_card_text'
            placeholder="Atras da carta"
            value={back}
            onChange={(e) => setBack(e.target.value)}
          />
          <br/>
        </form>
        </div>
        <button onClick={addCard}>Adicionar Carta</button>
      </div>
    </div>
  )
}

export default App
