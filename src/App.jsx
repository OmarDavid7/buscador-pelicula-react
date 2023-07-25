import './App.css'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import  YouTube  from 'react-youtube'

function App() {

  //credenciales de url y api key
  const URL = 'https://api.themoviedb.org/3'
  const APIKEY = 'f18a7fc1bd256125ef75910fe416684b'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

  //variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [trailer, setTrailer] = useState(null)
  const [movie, setMovie] = useState({title: "Loading Movies"});
  const [playing, setPlaying] = useState(false);


  //funcion para realizar la peticion por get a la apikey
  const fecthMovies = async(searchKey)=>{
    const type = searchKey ? 'search' : 'discover';
    const {data : {results},} = await axios.get(`${URL}/${type}/movie`, {
      params: {
        api_key: APIKEY,
        query: searchKey,
      }
    });

    setMovies(results);
    setMovie(results[0]);

    if(results.length){
      await fecthMovie(results[0].id)
     }
  }

  //funcion para la peticion de un solo objeto y mostratr en reproductor de video
  const fecthMovie = async(id) =>{
    const { data } = await axios.get(`${URL}/movie/${id}`, {
      params:{
        api_key: APIKEY,
        append_to_response: "videos",
      }
    })

    if(data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        (vid)=> vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  const selectMovie = async(movie)=>{
    fecthMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0,0)
  }

  useEffect(()=>{
    fecthMovies();
  },[])

  //funcion para buscar peliculas
  const searchMovies = (e)=>{
    e.preventDefault();
    fecthMovies(searchKey)
  }

  return (
    <>
    <h2 className='text-center mt-5 mb-5'>Buscador de Peliculas</h2>
    {/*buscador*/}
    <form className='container mb-4 text-center' onSubmit={searchMovies}>
      <input type="text" placeholder='search' onChange={(e)=> setSearchKey(e.target.value)} />
      <button className='btn btn-primary m-2 btn-sm'>Search</button>
    </form>

    {/*aqui va todo el contenedor del banner y del reproductor de video*/}
    <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer container"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>


     {/*contenedor que va a mostrar los poster de las peliculas actuales*/}
     <div className='container mt-3'>
      <div className="row">
        {movies.map(movie =>(
          <div key={movie.id} className='col-md-4 mb-3' onClick={()=> selectMovie(movie)}>
            <img src={`${IMAGE_PATH + movie.poster_path}`} alt="" width="100%" height={500} />
            <h4 className='text-center'>{movie.title}</h4>
          </div>
        ))}
      </div>
     </div>
    </>
  )
}

export default App
