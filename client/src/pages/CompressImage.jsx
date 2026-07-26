import React, { useContext, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'

const CompressImage = () => {

  const { compressImage, navigate } = useContext(AppContext)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [quality, setQuality] = useState(70)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setResult(null)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!selectedFile || loading) return

    setLoading(true)
    const data = await compressImage(selectedFile, quality)
    if (data) {
      setResult(data)
    }
    setLoading(false)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(result.resultImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `imaginocraft-compressed-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const savedPercent = result
    ? Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)
    : 0

  return (
    <div className='relative flex flex-col min-h-[90vh] justify-center items-center px-4'>

      <button
        type='button'
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-black bg-white/60 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
      >
        ←
      </button>

      <h1 className='text-2xl sm:text-3xl font-medium mb-2'>Compress Image</h1>
      <p className='text-sm text-gray-500 mb-8'>Free — no credits used</p>

      {!previewUrl &&
        <label
          htmlFor='compress-upload'
          className='w-full max-w-sm h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors text-gray-500'
        >
          <p className='text-sm'>Click to upload an image</p>
          <p className='text-xs mt-1'>PNG, JPG, or WEBP</p>
          <input
            id='compress-upload'
            ref={fileInputRef}
            type='file'
            accept='image/png, image/jpeg, image/webp'
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      }

      {previewUrl && !result &&
        <div className='w-full max-w-sm flex flex-col items-center'>
          <img src={previewUrl} alt='preview' className='w-full max-h-72 object-contain rounded-lg bg-gray-100' />

          <div className='w-full mt-6'>
            <label className='text-sm text-gray-600'>Quality: {quality}%</label>
            <input
              type='range'
              min='10'
              max='95'
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className='w-full mt-1'
            />
          </div>

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
              {loading ? 'Compressing...' : 'Compress'}
            </button>
          </div>
        </div>
      }

      {result &&
        <div className='w-full max-w-sm flex flex-col items-center'>
          <img src={result.resultImage} alt='result' className='w-full max-h-72 object-contain rounded-lg bg-gray-100' />

          <div className='w-full mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 text-center'>
            {formatSize(result.originalSize)} → {formatSize(result.compressedSize)}
            <span className='font-semibold'> ({savedPercent}% smaller)</span>
          </div>

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

export default CompressImage