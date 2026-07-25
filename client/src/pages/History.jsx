import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'

const History = () => {

  const { getUserImages } = useContext(AppContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchImages = async () => {
    setLoading(true)
    const data = await getUserImages()
    setImages(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <div className='min-h-[80vh] pt-14 mb-10'>
      <h1 className='text-center text-3xl font-medium mb-10'>Your Generated Images</h1>

      {loading && <p className='text-center text-gray-500'>Loading...</p>}

      {!loading && images.length === 0 &&
        <p className='text-center text-gray-500'>You haven't generated any images yet.</p>
      }

      <div className='flex flex-wrap justify-center gap-4'>
        {images.map((item, index) => (
          <div key={index} className='w-full sm:w-56'>
            <img src={item.imageUrl} alt={item.prompt} className='rounded-lg w-full h-56 object-cover' />
            <p className='text-sm text-gray-600 mt-2 line-clamp-2'>{item.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History