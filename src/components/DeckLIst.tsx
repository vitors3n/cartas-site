import { useEffect, useState } from 'react'
import { Deck } from '../interfaces/deck';

function DeckList() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        console.log(decks)
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
            <>
                <div key={deck.id}>{deck.name}</div>
                <ul>
                {deck.cards.map(card => (
                    <li key={card.id}>{card.front}</li>
                ))}    
                </ul>
            </>
        ))}
    </div>
  )
}

export default DeckList
