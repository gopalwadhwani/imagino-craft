import React, { useContext } from 'react'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const tools = [
  {
    name: 'Generate Image',
    desc: 'Describe anything and generate a unique AI image in seconds.',
    icon: '🎨',
    path: '/result'
  },
  {
    name: 'Edit with AI (Beta)',
    desc: 'Refine a generated image with follow-up instructions.',
    icon: '💬',
    path: '/edit'
  },
  {
    name: 'Remove Background',
    desc: 'Instantly cut out the background from any photo.',
    icon: '✂️',
    path: '/remove-bg'
  },
  {
    name: 'Compress Image',
    desc: 'Shrink file size while keeping the quality you choose. Free.',
    icon: '📦',
    path: '/compress'
  },
  {
    name: 'Image to PDF',
    desc: 'Combine multiple images into one clean PDF document. Free.',
    icon: '📄',
    path: '/to-pdf'
  },
]

const ToolsShowcase = () => {

  const { user, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const handleClick = (path) => {
    if (user) {
      navigate(path)
    } else {
      setShowLogin(true)
    }
  }

  return (
    <motion.div className='my-16 sm:my-24 px-4'
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}>

      <h2 className='text-center text-2xl sm:text-3xl font-medium mb-2'>Everything you need, in one place</h2>
      <p className='text-center text-gray-500 mb-10 max-w-lg mx-auto'>
        More than just text-to-image — a full toolkit for creating and editing images.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto'>
        {tools.map((tool) => (
          <div
            key={tool.path}
            onClick={() => handleClick(tool.path)}
            className='bg-white border rounded-xl p-5 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center'
          >
            <p className='text-3xl mb-3'>{tool.icon}</p>
            <p className='font-medium mb-1'>{tool.name}</p>
            <p className='text-xs text-gray-500'>{tool.desc}</p>
          </div>
        ))}
      </div>

    </motion.div>
  )
}

export default ToolsShowcase