import { assets } from '../assets/assets'
import { motion } from "motion/react"

const Footer = () => {
    return (
        <motion.div className='flex items-center justify-between gap-4 py-3 mt-20'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}>

            <img src={assets.logo} alt="" width={150} />

            <p className='flex-1 broder-1 border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>
                Copyright @GreatStack.dev | All right reserved.
            </p>

            <div className='flex gap-2.5'>
                <img src={assets.facebook_icon} alt="" width={35} />
                <img src={assets.twitter_icon} alt="" width={35} />
                <img src={assets.instagram_icon} alt="" width={35} />
            </div>

        </motion.div>
    )
}

export default Footer