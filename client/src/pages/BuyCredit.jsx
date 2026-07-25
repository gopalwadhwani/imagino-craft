import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const BuyCredit = () => {

  const { user, paymentRazorpay, navigate } = useContext(AppContext)

  return (
    <div className='relative min-h-[80vh] text-center pt-14 mb-10 px-4'>

      <button
        type='button'
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-black bg-white/60 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
      >
        ←
      </button>

      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index) => (
          <div key={index}
            className='w-full max-w-xs sm:w-64 mx-auto sm:mx-0 bg-white drop-shadow-sm border rounded-lg py-10 sm:py-12 px-6 sm:px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
            <img width={40} src={assets.logo_icon} alt="" />
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>${item.price}</span> / {item.credits} credits
            </p>
            <button onClick={() => paymentRazorpay(item.id)}
              className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5'>
              {user ? 'Purchase' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default BuyCredit