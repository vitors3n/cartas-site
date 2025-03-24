import { useEffect, useState } from 'react'
import { Deck } from '../interfaces/deck';
import ReviewCards from './ReviewCard';
import '../styles/ListDeck.css';

function ListDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  const updateSelectDeck = (deck : Deck) => {
    setSelectedDeck(deck);
  };

  useEffect(() => {

    fetch("http://localhost:8080/api/v1/deck")
      .then((response) => {
        if(!response.ok){
          throw new Error("Falha ao pegar cartas");
        }
        return response.json();
      })
      .then((response_decks) => {
        setDecks(response_decks);
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
        {decks.map( (deck)=> (
          <button className='deck_button' key={deck.id} onClick={() => updateSelectDeck(deck)}>
            {deck.name} 
            <span className='deck_length'>{deck.cards.length}</span>
          </button>
        ))}

        {selectedDeck ? (
          <ReviewCards cards={selectedDeck.cards} />
        ):(
          <></>
        )}

    </div>
  )
}

export default ListDecks
