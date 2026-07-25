import { assets, testimonialsData } from '../assets/assets'
import { motion } from "motion/react"

const Testimonials = () => {
    return (
        <motion.div
            className='flex flex-col items-center justify-center my-16 sm:my-20 py-8 sm:py-12 px-4 sm:px-6'
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
                Customer testimonials
            </motion.h1>

            <motion.p
                className='text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base text-center'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
            >
                What Our Users Are Saying
            </motion.p>

            <div className='flex flex-wrap justify-center gap-4 sm:gap-6 w-full'>

                {testimonialsData.map((testimonail, index) => (
                    <motion.div
                        key={index}
                        className='bg-white/20 p-6 sm:p-8 md:p-12 rounded-lg shadow-md border w-full max-w-80 m-auto cursor-pointer hover:scale-[1.02] transition-all'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >

                        <div className='flex flex-col items-center'>

                            <img
                                src={testimonail.image}
                                alt=""
                                className='rounded-full w-14'
                            />

                            <h2 className='text-lg sm:text-xl font-semibold mt-3 text-center'>
                                {testimonail.name}
                            </h2>

                            <p className='text-gray-500 mb-4 text-sm sm:text-base text-center'>
                                {testimonail.role}
                            </p>

                            <div className='flex mb-4'>
                                {Array(testimonail.stars).fill().map((item, index) => (
                                    <img
                                        key={index}
                                        src={assets.rating_star}
                                        alt=""
                                        className='w-4 sm:w-auto'
                                    />
                                ))}
                            </div>

                            <p className='text-center text-sm text-gray-600 leading-6'>
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