import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'

const ConversationalEdit = () => {

  const { startEditSessionFromPrompt, sendEditMessage, navigate } = useContext(AppContext)

  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentImage, setCurrentImage] = useState(null)
  const [instruction, setInstruction] = useState('')
  const [startPrompt, setStartPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStartFromPrompt = async () => {
    if (!startPrompt.trim() || loading) return

    setLoading(true)
    const data = await startEditSessionFromPrompt(startPrompt)
    setLoading(false)

    if (data) {
      setSessionId(data.sessionId)
      setCurrentImage(data.imageUrl)
      setMessages([
        { role: 'user', text: startPrompt },
        { role: 'model', imageUrl: data.imageUrl }
      ])
      setStartPrompt('')
    }
  }

  const handleSend = async () => {
    if (!instruction.trim() || loading || !sessionId) return

    const userMessage = { role: 'user', text: instruction }
    setMessages(prev => [...prev, userMessage])
    setInstruction('')
    setLoading(true)

    const data = await sendEditMessage(sessionId, userMessage.text)
    setLoading(false)

    if (data) {
      setCurrentImage(data.imageUrl)
      setMessages(prev => [...prev, { role: 'model', text: data.text, imageUrl: data.imageUrl }])
    }
  }

  const handleReset = () => {
    setSessionId(null)
    setMessages([])
    setCurrentImage(null)
    setInstruction('')
    setStartPrompt('')
  }

  const handleKeyDown = (e, onEnter) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onEnter()
    }
  }

  return (
    <div className='relative flex flex-col min-h-[90vh] px-4 pt-14 pb-6'>

      <button
        type='button'
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-black bg-white/60 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
      >
        ←
      </button>

      <h1 className='text-center text-2xl sm:text-3xl font-medium mb-2'>Generate & Edit with AI</h1>
      <p className='text-center text-sm text-gray-500 mb-6'>Describe an image, then keep refining it with follow-up instructions</p>

      {!sessionId &&
        <div className='flex-1 flex flex-col items-center justify-center gap-4'>
          <div className='flex w-full max-w-md bg-neutral-100 p-1.5 rounded-full'>
            <input
              value={startPrompt}
              onChange={(e) => setStartPrompt(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleStartFromPrompt)}
              disabled={loading}
              placeholder='Describe what you want to generate...'
              className='flex-1 bg-transparent outline-none text-sm px-4 min-w-0'
            />
            <button
              onClick={handleStartFromPrompt}
              disabled={loading || !startPrompt.trim()}
              className={`bg-zinc-900 text-white px-6 py-2 rounded-full text-sm whitespace-nowrap ${loading || !startPrompt.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      }

      {sessionId &&
        <div className='flex-1 flex flex-col max-w-2xl w-full mx-auto'>

          <div className='flex-1 flex flex-col items-center'>
            <img src={currentImage} alt='' className='max-w-full max-h-[45vh] object-contain rounded-lg border' />
            <button
              onClick={handleReset}
              className='text-xs text-gray-500 underline mt-2'
            >
              Start over
            </button>
          </div>

          <div className='flex-1 overflow-y-auto mt-4 space-y-3 max-h-52'>
            {messages.filter(m => m.text).map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading &&
              <div className='flex justify-start'>
                <div className='max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-gray-100 text-gray-400'>
                  Working on it...
                </div>
              </div>
            }
          </div>

          <div className='flex gap-2 mt-4 bg-neutral-100 p-1.5 rounded-full'>
            <input
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleSend)}
              disabled={loading}
              placeholder='Describe what to change...'
              className='flex-1 bg-transparent outline-none text-sm px-4 min-w-0'
            />
            <button
              onClick={handleSend}
              disabled={loading || !instruction.trim()}
              className={`bg-zinc-900 text-white px-6 py-2 rounded-full text-sm whitespace-nowrap ${loading || !instruction.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Send
            </button>
          </div>
        </div>
      }

    </div>
  )
}

export default ConversationalEdit