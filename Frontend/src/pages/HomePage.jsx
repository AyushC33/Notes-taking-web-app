import Navbar from '../components/Navbar'
import { useState } from 'react'
import RatelimitedUI from '../components/RateLimitedUI.jsx'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Notecard from '../components/Notecard.jsx'
import api from '../lib/axios'
import NotesNotFound from '../components/NotesNotFound.jsx'

const HomePage = () => {
  const [isratelimited, setIsRatelimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes")
        console.log(res.data);
        setNotes(res.data);
        setIsRatelimited(false);
      } catch (error) {
        console.log("Error fetching notes:");
        console.log(error);
        if(error.response?.status === 429){
          setIsRatelimited(true);
        } else {
          toast.error("Failed to load notes")
      }
    }
    finally{
      setLoading(false);
    }
  }

    fetchNotes();
  }, [])


  return (
    <div className='min-h-screen'>
      <Navbar />

      {isratelimited && <RatelimitedUI />}

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading notes...</div>}

        {notes.length === 0 && !isratelimited && <NotesNotFound />}

        {notes.length > 0 && !isratelimited && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {notes.map((note) => (
              <Notecard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
      </div>
  );
};

export default HomePage