import React, { useContext, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'

const ImageToPdf = () => {

  const { imagesToPdf, navigate } = useContext(AppContext)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [resultPdf, setResultPdf] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setSelectedFiles(files)
    setResultPdf(null)
    setPreviews(files.map(file => URL.createObjectURL(file)))
  }

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || loading) return

    setLoading(true)
    const pdfUrl = await imagesToPdf(selectedFiles)
    if (pdfUrl) {
      setResultPdf(pdfUrl)
    }
    setLoading(false)
  }

  const handleReset = () => {
    setSelectedFiles([])
    setPreviews([])
    setResultPdf(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(resultPdf)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `imaginocraft-${Date.now()}.pdf`
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

      <h1 className='text-2xl sm:text-3xl font-medium mb-2'>Image to PDF</h1>
      <p className='text-sm text-gray-500 mb-8'>Free — no credits used</p>

      {previews.length === 0 &&
        <label
          htmlFor='pdf-upload'
          className='w-full max-w-sm h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors text-gray-500'
        >
          <p className='text-sm'>Click to upload images</p>
          <p className='text-xs mt-1'>Select multiple — up to 10</p>
          <input
            id='pdf-upload'
            ref={fileInputRef}
            type='file'
            accept='image/png, image/jpeg'
            multiple
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      }

      {previews.length > 0 && !resultPdf &&
        <div className='w-full max-w-sm flex flex-col items-center'>
          <div className='w-full grid grid-cols-3 gap-2'>
            {previews.map((src, i) => (
              <img key={i} src={src} alt='' className='w-full h-20 object-cover rounded' />
            ))}
          </div>
          <p className='text-xs text-gray-500 mt-2'>{selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected</p>

          <div className='flex gap-2 w-full mt-6'>
            <button
              onClick={handleReset}
              className='flex-1 border border-gray-400 text-gray-700 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors'
            >
              Choose Different
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 bg-zinc-900 text-white py-2.5 rounded-full text-sm hover:bg-zinc-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating PDF...' : 'Create PDF'}
            </button>
          </div>
        </div>
      }

      {resultPdf &&
        <div className='w-full max-w-sm flex flex-col items-center'>
          <div className='w-full h-64 border rounded-lg flex flex-col items-center justify-center bg-gray-50 text-gray-500'>
            <p className='text-4xl mb-2'>📄</p>
            <p className='text-sm'>Your PDF is ready</p>
          </div>

          <div className='flex gap-2 w-full mt-6'>
            <button
              onClick={handleReset}
              className='flex-1 border border-gray-400 text-gray-700 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors'
            >
              Start Over
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

export default ImageToPdf