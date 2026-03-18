import { assets, testimonialsData } from '../assets/assets'
import { motion } from "motion/react"

const Testimonials = () => {
    return (
        <motion.div className='flex flex-col items-center justify-center my-20 py-12'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            <motion.h1 className='text-3xl sm:text-4xl font-semibold mb-2'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}>
                Customer testimonials
            </motion.h1>

            <motion.p className='text-gray-500 mb-12'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}>
                What Our Users Are Saying
            </motion.p>

            <div className='flex flex-wrap gap-6'>

                {testimonialsData.map((testimonail, index) => (
                    <motion.div key={index} className='bg-white/20 p-12 rounded-lg shadow-md border w-80 m-auto cursor-pointer hover:scale-[1.02] transition-all'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}>

                        <div className='flex flex-col items-center'>
                            <img
                                src={testimonail.image}
                                alt=""
                                className='rounded-full w-14'
                            />

                            <h2 className='text-xl font-semibold mt-3'>
                                {testimonail.name}
                            </h2>

                            <p className='text-gray-500 mb-4'>
                                {testimonail.role}
                            </p>

                            <div className='flex mb-4'>
                                {Array(testimonail.stars).fill().map((item, index) => (
                                    <img
                                        key={index}
                                        src={assets.rating_star}
                                        alt=""
                                    />
                                ))}
                            </div>

                            <p className='text-center text-sm text-gray-600'>
                                {testimonail.text}
                            </p>

                        </div>

                    </motion.div>
                ))}

            </div>

        </motion.div>
    )
}

export default Testimonials