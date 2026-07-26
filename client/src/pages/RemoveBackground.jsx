import React, { useContext, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'

const RemoveBackground = () => {

  const { removeBg, navigate } = useContext(AppContext)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setResultImage(null)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!selectedFile || loading) return

    setLoading(true)
    const result = await removeBg(selectedFile)
    if (result) {
      setResultImage(result)
    }
    setLoading(false)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResultImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(resultImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `imaginocraft-bg-removed-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='relative flex flex-col min-h-[90vh] justify-center items-center px-4'>

      <button
        type='button'
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-black bg-white/60 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
      >
        ←
      </button>

      <h1 className='text-2xl sm:text-3xl font-medium mb-8'>Remove Background</h1>

      {!previewUrl &&
        <label
          htmlFor='bg-upload'
          className='w-full max-w-sm h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors text-gray-500'
        >
          <p className='text-sm'>Click to upload an image</p>
          <p className='text-xs mt-1'>PNG, JPG, or WEBP</p>
          <input
            id='bg-upload'
            ref={fileInputRef}
            type='file'
            accept='image/png, image/jpeg, image/webp'
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      }

      {previewUrl && !resultImage &&
        <div className='w-full max-w-sm flex flex-col items-center'>
          <img src={previewUrl} alt='preview' className='w-full max-h-80 object-contain rounded-lg bg-gray-100' />

          <div className='flex gap-2 w-full mt-6'>
            <button
              onClick={handleReset}
              className='flex-1 border border-gray-400 text-gray-700 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors'
            >
              Choose Another
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 bg-zinc-900 text-white py-2.5 rounded-full text-sm hover:bg-zinc-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Removing...' : 'Remove Background'}
            </button>
          </div>
        </div>
      }

      {resultImage &&
        <div className='w-full max-w-sm flex flex-col items-center'>
          <img
            src={resultImage}
            alt='result'
            className='w-full max-h-80 object-contain rounded-lg'
            style={{ backgroundImage: 'conic-gradient(#e5e7eb 25%, transparent 0 50%, #e5e7eb 0 75%, transparent 0)', backgroundSize: '20px 20px' }}
          />

          <div className='flex gap-2 w-full mt-6'>
            <button
              onClick={handleReset}
              className='flex-1 border border-gray-400 text-gray-700 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors'
            >
              Try Another
            </button>
            <button
              onClick={handleDownload}
              className='flex-1 bg-zinc-900 text-white py-2.5 rounded-full text-sm hover:bg-zinc-800 transition-colors'
            >
              Download
            </button>
          </div>
        </div>
      }

    </div>
  )
}

export default RemoveBackground