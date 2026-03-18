import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"

const Description = () => {
  return (
    <motion.div className='flex flex-col items-center justify-center my-24 p-6 md:px-28'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}>

      <motion.h1 className='text-3xl sm:text-4xl font-semibold mb-2'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}>Create AI Images</motion.h1>

      <motion.p className='text-gray-500 mb-8'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}>Turn your imagination into visuals</motion.p>

      <div className='flex flex-col md:flex-row items-center gap-10'>

        <motion.img src={assets.sample_img_1} alt="" className='w-80 xl:w-96 rounded-lg'
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }} />

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}>
          <h2 className='text-2xl font-medium mb-4'>
            Introducing the AI-Powered Text to Image Generator
          </h2>

          <p className='text-gray-600 mb-4'>
            Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or unique imagery, our tool transforms your text into eye-catching images with just a few clicks. Imagine it, describe it, and watch it come to life instantly.
          </p>

          <p className='text-gray-600'>
            Simply type in a text prompt, and our cutting-edge AI will generate high-quality images in seconds. From product visuals to character designs and portraits, even concepts that don't yet exist can be visualized effortlessly. Powered by advanced AI technology, the creative possibilities are limitless!
          </p>
        </motion.div>

      </div>
    </motion.div>
  )
}

export default Description