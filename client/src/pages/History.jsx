import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const History = () => {

  const { getUserImages, deleteImage } = useContext(AppContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

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
    e.stopPropagation()
    const success = await deleteImage(imageId)
    if (success) {
      setImages(prev => prev.filter(img => img._id !== imageId))
      setSelectedImage(null)
    }
  }

  return (
    <div className='min-h-[80vh] pt-14 mb-10'>
      <h1 className='text-center text-3xl font-medium mb-10'>Your Generated Images</h1>

      {loading && <p className='text-center text-gray-500'>Loading...</p>}

      {!loading && images.length === 0 &&
        <div className='flex flex-col items-center justify-center text-center mt-10'>
          <img src={assets.sample_img_1} alt="" className='w-40 opacity-40 mb-4 rounded' />
          <p className='text-gray-500'>You haven't generated any images yet.</p>
        </div>
      }

      <div className='flex flex-wrap justify-center gap-4'>
        {images.map((item) => (
          <div key={item._id}
            onClick={() => setSelectedImage(item)}
            className='w-full sm:w-56 cursor-pointer group relative'>
            <img src={item.imageUrl} alt={item.prompt} className='rounded-lg w-full h-56 object-cover' />
            <button
              onClick={(e) => handleDelete(e, item._id)}
              className='absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
            >
              ✕
            </button>
            <p className='text-sm text-gray-600 mt-2 line-clamp-2'>{item.prompt}</p>
          </div>
        ))}
      </div>

      {selectedImage &&
        <div
          onClick={() => setSelectedImage(null)}
          className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'
        >
          <div onClick={(e) => e.stopPropagation()} className='max-w-lg w-full bg-white rounded-lg overflow-hidden'>
            <img src={selectedImage.imageUrl} alt={selectedImage.prompt} className='w-full max-h-[70vh] object-contain bg-black' />
            <div className='p-4 flex justify-between items-center gap-4'>
              <p className='text-sm text-gray-600'>{selectedImage.prompt}</p>
              <button
                onClick={(e) => handleDelete(e, selectedImage._id)}
                className='shrink-0 bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-600 transition-colors'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default History