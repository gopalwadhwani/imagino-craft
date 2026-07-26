import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const History = () => {

  const { getUserImages, deleteImage, toggleFavorite, navigate } = useContext(AppContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [filter, setFilter] = useState('all')

  const fetchImages = async () => {
    setLoading(true)
    const data = await getUserImages()
    setImages(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleDelete = async (e, imageId) => {
    if (e) e.stopPropagation()
    const success = await deleteImage(imageId)
    if (success) {
      const updated = images.filter(img => img._id !== imageId)
      setImages(updated)
      setSelectedIndex(null)
    }
  }

  const handleToggleFavorite = async (e, imageId) => {
    if (e) e.stopPropagation()
    const newFavoriteState = await toggleFavorite(imageId)
    if (newFavoriteState !== null) {
      setImages(prev => prev.map(img =>
        img._id === imageId ? { ...img, favorite: newFavoriteState } : img
      ))
    }
  }

  const handleDownload = async (e, imageUrl) => {
    e.stopPropagation()
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `imaginocraft-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
    }
  }

  const filteredImages = filter === 'favorites' ? images.filter(img => img.favorite) : images

  const showPrev = (e) => {
    e.stopPropagation()
    setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredImages.length - 1))
  }

  const showNext = (e) => {
    e.stopPropagation()
    setSelectedIndex(prev => (prev < filteredImages.length - 1 ? prev + 1 : 0))
  }

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null

  return (
    <div className='relative min-h-[80vh] pt-14 mb-10'>

      <button
        type='button'
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-black bg-white/60 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
      >
        ←
      </button>

      <h1 className='text-center text-3xl font-medium mb-4'>Your Generated Images</h1>

      <div className='flex justify-center gap-2 mb-8'>
        <button
          onClick={() => { setFilter('all'); setSelectedIndex(null) }}
          className={`px-5 py-1.5 rounded-full text-sm transition-colors ${filter === 'all' ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => { setFilter('favorites'); setSelectedIndex(null) }}
          className={`px-5 py-1.5 rounded-full text-sm transition-colors ${filter === 'favorites' ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          ⭐ Favorites
        </button>
      </div>

      {loading && <p className='text-center text-gray-500'>Loading...</p>}

      {!loading && filteredImages.length === 0 &&
        <div className='flex flex-col items-center justify-center text-center mt-10'>
          <img src={assets.sample_img_1} alt="" className='w-40 opacity-40 mb-4 rounded' />
          <p className='text-gray-500'>
            {filter === 'favorites' ? "You haven't favorited any images yet." : "You haven't generated any images yet."}
          </p>
        </div>
      }

      <div className='flex flex-wrap justify-center gap-4'>
        {filteredImages.map((item, index) => (
          <div key={item._id}
            onClick={() => setSelectedIndex(index)}
            className='w-full sm:w-56 cursor-pointer group relative'>
            <img src={item.imageUrl} alt={item.prompt} className='rounded-lg w-full h-56 object-cover' />

            <button
              onClick={(e) => handleToggleFavorite(e, item._id)}
              className='absolute top-2 left-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-transform hover:scale-110'
            >
              {item.favorite ? '⭐' : '☆'}
            </button>

            <button
              onClick={(e) => handleDelete(e, item._id)}
              className='absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-sm'
            >
              🗑
            </button>

            <p className='text-sm text-gray-600 mt-2 line-clamp-2'>{item.prompt}</p>
          </div>
        ))}
      </div>

      {selectedImage &&
        <div
          onClick={() => setSelectedIndex(null)}
          className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className='absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
          >
            ←
          </button>

          {filteredImages.length > 1 &&
            <button
              onClick={showPrev}
              className='absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
            >
              ‹
            </button>
          }

          {filteredImages.length > 1 &&
            <button
              onClick={showNext}
              className='absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
            >
              ›
            </button>
          }

          <div onClick={(e) => e.stopPropagation()} className='max-w-lg w-full bg-white rounded-lg overflow-hidden max-h-[85vh] flex flex-col'>
            <img src={selectedImage.imageUrl} alt={selectedImage.prompt} className='w-full max-h-[55vh] object-contain bg-black shrink-0' />
            <div className='p-4 overflow-y-auto'>
              <p className='text-sm text-gray-600 mb-4'>{selectedImage.prompt}</p>
              <div className='flex gap-2'>
                <button
                  onClick={(e) => handleToggleFavorite(e, selectedImage._id)}
                  className='px-4 py-2 rounded-full text-sm border border-gray-300 hover:bg-gray-50 transition-colors'
                >
                  {selectedImage.favorite ? '⭐' : '☆'}
                </button>
                <button
                  onClick={(e) => handleDownload(e, selectedImage.imageUrl)}
                  className='flex-1 text-center bg-zinc-900 text-white text-sm px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors'
                >
                  Download
                </button>
                <button
                  onClick={(e) => handleDelete(e, selectedImage._id)}
                  className='flex-1 bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-600 transition-colors'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default History