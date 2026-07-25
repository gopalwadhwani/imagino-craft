import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'

const GenerateBtn = () => {
    const { user, setShowLogin, navigate } = useContext(AppContext)

    const onClickHandler = () => {
        if (user) {
            navigate('/result')
        } else {
            setShowLogin(true)
        }
    }

    return (
        <motion.div
            className='pb-12 sm:pb-16 text-center px-4 sm:px-6'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >

            <motion.h1
                className='text-2xl sm:text-3xl md:text-4xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-8 sm:py-12 md:py-16'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
            >
                See the magic. Try now
            </motion.h1>

            <motion.button
                onClick={onClickHandler}
                className='inline-flex items-center justify-center gap-2 px-8 sm:px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-105 transition-all duration-500 text-sm sm:text-base'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
            >
                Generate Images
                <img
                    src={assets.star_group}
                    alt=""
                    className='h-5 sm:h-6'
                />
            </motion.button>

        </motion.div>
    )
}

export default GenerateBtn