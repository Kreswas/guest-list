import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const baseUrl =
    'https://96f415e0-49e0-4a23-983f-8290a09e43e3.id.repl.co/guests/';
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setName('');
    setLastName('');
  };

  useEffect(() => {
    async function fetchGuests() {
      setIsLoading(true);
      const response = await fetch({ baseUrl });
      const allGuests = await response.json();
      setIsLoading(false);
      setGuests(allGuests);
    }
    fetchGuests().catch((err) => console.log(err));
  }, []);
  async function getNewGuest() {
    const response = await fetch(
      { baseUrl },
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: name, lastName: lastName }),
      },
    );
    const createdGuest = await response.json();

    setGuests([...guests, createdGuest]);
  }

  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    setGuests(guests.filter((guest) => guest.id !== deletedGuest.id));
  }
  async function attendingGuest(id, checkStatus) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: checkStatus }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
    console.log(guests);
    setGuests(
      guests.map((guest) =>
        guest.id === updatedGuest.id ? updatedGuest : guest,
      ),
    );
  }
  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label>
            First Name:
            <input
              value={name}
              onChange={(event) => {
                setName(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              value={lastName}
              onChange={(event) => {
                setLastName(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <button
            onClick={async () => {
              handleClick();
              await getNewGuest();
            }}
          >
            Return
          </button>
          <br />
        </form>
      )}
      {guests.map((guest) => {
        return (
          <div data-test-id="guest" key={`guest_${guest.id}`}>
            <span>{guest.firstName} </span>
            <span>{guest.lastName}</span>
            <button
              onClick={async () => {
                await deleteGuest(guest.id);
              }}
            >
              Remove
            </button>
            <label>
              <input
                checked={guest.attending}
                type="checkbox"
                aria-label="attending"
                onChange={async (event) => {
                  const checkStatus = event.currentTarget.checked;
                  await attendingGuest(guest.id, checkStatus);
                }}
              />
              {guest.attending ? 'attending' : 'Not attending'}
            </label>
          </div>
        );
      })}
    </>
  );
}
export default App;
