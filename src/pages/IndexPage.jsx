import { useNavigate } from 'react-router-dom'

function IndexPage() {
  const navigate = useNavigate()

  const handleStart = () => {
    const difficulty = document.getElementById('difficulty').value
    localStorage.setItem('difficulty', difficulty)
    navigate('/game')
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-2 text-[#8B5A3C]">Survival Chess</h1>
      <h3 className="text-xl mb-8 text-[#6B4E3D]">by Sharon Chen</h3>

      <p className="text-2xl text-center mb-8">
        A single-player Chess game with a twist of luck
      </p>

      <div className="w-full max-w-2xl border-t-2 border-b-2 border-[#5C7A7A] bg-white p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#8B5A3C]">Game Rules:</h2>
        <p className="text-lg leading-relaxed">
          Legal moves are exactly like classic Chess (except: no castling)
          <br /> The goal is to gain points by capturing black pieces
          <br /> captures are possible only with the same piece type
          <br /> (for example: a black-king can be captured only by a white-king)
          <br />
          <br /> Blocks are added randomly according to difficulty
          <br /> Try to survive as long as possible before the blocks destroy all your pieces
        </p>
      </div>

      <h3 className="text-xl mb-8 text-center">
        tip:
        <br /> Extra points are given for captures in a row,
        <br /> and for clearing all the blocks from the board
      </h3>

      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-[#8B5A3C]">
          Select Difficulty:
          <select 
            id="difficulty" 
            className="ml-2 px-3 py-2 bg-[#5C7A7A] text-white rounded border-none cursor-pointer"
          >
            <option value="4">Easy</option>
            <option value="3">Medium</option>
            <option value="2">Hard</option>
            <option value="1">Impossible</option>
          </select>
        </h2>
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-[#5C7A7A] text-white text-xl font-semibold rounded hover:bg-[#4A5F5F] transition-colors"
        >
          START
        </button>
      </div>
    </div>
  )
}

export default IndexPage
