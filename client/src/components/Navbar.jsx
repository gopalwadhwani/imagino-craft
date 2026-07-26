import React, { useContext, useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import favicon from "../assets/favicon.svg";
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const Navbar = () => {

  const { user, setShowLogin, logout, credit } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const menuRef = useRef(null)
  const toolsRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false)
      }
    }

    if (menuOpen || toolsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [menuOpen, toolsOpen])

  const toolLinks = [
    { label: 'Generate Image', path: '/result' },
    { label: 'Edit with AI (Beta)', path: '/edit' },
    { label: 'Remove Background', path: '/remove-bg' },
    { label: 'Compress Image', path: '/compress' },
    { label: 'Image to PDF', path: '/to-pdf' },
  ]

  return (
    <div className='flex items-center justify-between gap-2 py-4 px-4'>
      <Link to='/' className="flex items-center gap-1 min-w-0 shrink">
        <img src={favicon} alt="" className='w-10 sm:w-12 lg:w-16 shrink-0' />
        <h1 className='text-blue-700 text-lg sm:text-2xl lg:text-3xl font-bold truncate'>ImaginoCraft</h1>
      </Link>

      {
        user ?
          <div className='flex items-center gap-2 sm:gap-3 shrink-0'>

            <div className='relative max-sm:hidden' ref={toolsRef}>
              <p
                onClick={() => setToolsOpen(prev => !prev)}
                className='cursor-pointer text-gray-600 hover:text-black transition-all flex items-center gap-1'
              >
                Tools <span className='text-xs'>▾</span>
              </p>

              {toolsOpen &&
                <div className='absolute top-0 right-0 z-20 text-black rounded pt-8'>
                  <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm shadow-md whitespace-nowrap'>
                    {toolLinks.map(tool => (
                      <li
                        key={tool.path}
                        onClick={() => { navigate(tool.path); setToolsOpen(false) }}
                        className='py-1.5 px-3 cursor-pointer hover:bg-gray-50 rounded'
                      >
                        {tool.label}
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </div>

            <p onClick={() => navigate('/history')} className='cursor-pointer text-gray-600 hover:text-black transition-all max-sm:hidden'>History</p>

            <button onClick={() => navigate('/buy')} className='flex items-center gap-1 bg-blue-100 px-2 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700 shrink-0'>
              <img className='w-4 sm:w-5' src={assets.credit_star} alt="" />
              <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits: {credit}</p>
            </button>

            <p
              onClick={() => navigate('/profile')}
              className='text-gray-600 max-sm:hidden pl-4 cursor-pointer hover:text-black transition-all'
            >
              Hi, {user.name}
            </p>

            <div className='relative shrink-0' ref={menuRef}>
              <img
                src={assets.profile_icon}
                className='w-10 drop-shadow cursor-pointer'
                alt=""
                onClick={() => setMenuOpen(prev => !prev)}
              />

              {menuOpen &&
                <div className='absolute top-0 right-0 z-20 text-black rounded pt-12'>
                  <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm shadow-md whitespace-nowrap'>
                    {toolLinks.map(tool => (
                      <li
                        key={tool.path}
                        onClick={() => { navigate(tool.path); setMenuOpen(false) }}
                        className='py-1 px-2 cursor-pointer pr-10 sm:hidden'
                      >
                        {tool.label}
                      </li>
                    ))}
                    <li onClick={() => { navigate('/history'); setMenuOpen(false) }} className='py-1 px-2 cursor-pointer pr-10 sm:hidden'>History</li>
                    <li onClick={() => { navigate('/profile'); setMenuOpen(false) }} className='py-1 px-2 cursor-pointer pr-10 sm:hidden'>Profile</li>
                    <li onClick={() => { logout(); setMenuOpen(false) }} className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                  </ul>
                </div>
              }
            </div>

          </div>
          :
          <div className='flex items-center gap-2 sm:gap-5 shrink-0'>
            <p onClick={() => navigate('/buy')} className='cursor-pointer'>Pricing</p>
            <button onClick={() => setShowLogin(true)} className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full'>Login</button>
          </div>
      }

    </div>
  )
}

export default Navbar