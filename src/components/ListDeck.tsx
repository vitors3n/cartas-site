import { useEffect, useState, useRef } from 'react'
import { Deck } from '../interfaces/deck';
import ReviewCards from './ReviewCard';
import '../styles/ListDeck.css';

function ListDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const toggleNewDeckModal = () => {
    if(dialogIsOpen){
      dialogRef.current?.close();
      setDialogIsOpen(false);
    } else {
      dialogRef.current?.showModal();
      setDialogIsOpen(true);
    }
  };

  const updateSelectDeck = (deck : Deck) => {
    setSelectedDeck(deck);
  };

  useEffect(() => {

    fetch("http://localhost:8080/api/v1/decks")
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
          <button 
            className={`deck_button ${selectedDeck?.id === deck.id ? "active":""}`} 
            key={deck.id} 
            onClick={() => updateSelectDeck(deck)}
          >
            {deck.name} 
            <span className='deck_length'>{deck.cards.length}</span>
          </button>
        ))}

          <button className="deck_button" onClick={toggleNewDeckModal}> 
            <span className='new_deck_button'>+</span>
          </button>

        {selectedDeck ? (
          <ReviewCards cards={selectedDeck.cards} />
        ):(
          <></>
        )}

      <dialog ref={dialogRef}>
        <form>
          <label htmlFor="">Dialog</label>
        </form>
        <button onClick={toggleNewDeckModal}>Fechar</button>
      </dialog>

    </div>
  )
}

export default ListDecks
