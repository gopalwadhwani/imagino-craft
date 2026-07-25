import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Result = () => {

  const [image, setImage] = useState(assets.sample_img_1)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')

  const { generateImage, navigate } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input || loading) return

    setLoading(true)
    setIsImageLoaded(false)

    try {
      const generatedImage = await generateImage(input)
      if (generatedImage) {
        setIsImageLoaded(true)
        setImage(generatedImage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='relative flex flex-col min-h-[90vh] justify-center items-center px-4'>

      <button
        type='button'
        onClick={() => navigate('/')}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-black bg-white/60 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
      >
        ←
      </button>

      <div className='w-full max-w-sm mx-auto'>
        <div className='relative'>
          <img src={image} alt="" className='w-full max-w-sm rounded' />
          <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'
            }`} />
        </div>
        <p className={!loading ? 'hidden' : ''}>Loading.....</p>
      </div>

      {!isImageLoaded &&
        <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>

          <input
            onChange={e => setInput(e.target.value)} value={input}
            type="text" placeholder='Describe what you want to generate'
            className='flex-1 min-w-0 bg-transparent outline-none ml-4 sm:ml-8 placeholder-color' />

          <button type='submit'
            disabled={loading}
            className={`bg-zinc-900 px-6 sm:px-16 py-3 rounded-full whitespace-nowrap ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      }

      {isImageLoaded &&
        <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
          <p onClick={() => { setIsImageLoaded(false); setInput('') }}
            className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
          <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
        </div>
      }

    </form>
  )
}

export default Result