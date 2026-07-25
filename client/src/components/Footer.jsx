import { assets } from '../assets/assets'
import { motion } from "motion/react"

const Footer = () => {
    return (
        <motion.div className='flex items-center justify-between gap-4 py-3 mt-20 px-4'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}>

            <img src={assets.logo} alt="" className='w-24 sm:w-32 md:w-40' />

            <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>
                Copyright @GreatStack.dev | All right reserved.
            </p>

            <div className='flex gap-2 sm:gap-2.5'>
                <img src={assets.facebook_icon} alt="" className='w-6 sm:w-8' />
                <img src={assets.twitter_icon} alt="" className='w-6 sm:w-8' />
                <img src={assets.instagram_icon} alt="" className='w-6 sm:w-8' />
            </div>

        </motion.div>
    )
}

export default Footer