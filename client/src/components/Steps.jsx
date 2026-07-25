import React from 'react'
import { stepsData } from '../assets/assets'
import { motion } from "motion/react"

const Steps = () => {
  return (
    <motion.div
      className='flex flex-col items-center justify-center my-20 sm:my-32 px-4 sm:px-6'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >

      <motion.h1
        className='text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-center'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
      >
        How it works
      </motion.h1>

      <motion.p
        className='text-base sm:text-lg text-gray-600 mb-8 text-center'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}
      >
        Transform Words Into Stunning Images
      </motion.p>

      <div className='space-y-4 w-full max-w-3xl text-sm'>

        {stepsData.map((item, index) => (
          <motion.div
            key={index}
            className='flex items-center gap-3 sm:gap-4 p-4 sm:p-5 px-4 sm:px-8 bg-white/20 shadow-md border cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-lg'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >

            <img
              width={40}
              src={item.icon}
              alt=""
              className='w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0'
            />

            <div className='min-w-0'>

              <h2 className='text-lg sm:text-xl font-medium'>
                {item.title}
              </h2>

              <p className='text-gray-500 text-sm sm:text-base leading-6'>
                {item.description}
              </p>

            </div>

          </motion.div>
        ))}

      </div>

    </motion.div>
  )
}

export default Steps