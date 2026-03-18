import React from 'react'
import { stepsData } from '../assets/assets'
import { motion } from "motion/react"

const Steps = () => {
  return (
    <motion.div className='flex flex-col items-center justify-center my-32'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}>

      <motion.h1 className='text-3xl sm:text-4xl font-semibold mb-2'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}>
        How it works
      </motion.h1>

      <motion.p className='text-lg text-gray-600 mb-8'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}>
        Transform Words Into Stunning Images
      </motion.p>

      <div className='space-y-4 w-full max-w-3xl text-sm'>
        {stepsData.map((item, index) => (
          <motion.div key={index} className='flex items-center gap-4 p-5 px-8 bg-white/20 shadow-md border cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-lg'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}>
            <img width={40} src={item.icon} alt="" />

            <div>
              <h2 className='text-xl font-medium'>
                {item.title}
              </h2>

              <p className='text-gray-500'>
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