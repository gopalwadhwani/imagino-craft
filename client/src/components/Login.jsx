import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const [state, setState] = useState('Login')
    const [showForgot, setShowForgot] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const { setShowLogin, backendUrl, setToken, setUser, forgotPassword } = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onForgotSubmit = async (e) => {
        e.preventDefault()
        const success = await forgotPassword(forgotEmail)
        if (success) {
            setShowForgot(false)
            setForgotEmail('')
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center px-4 sm:px-6'>

            {!showForgot ?
                <form
                    onSubmit={onSubmitHandler}
                    className='relative bg-white p-6 sm:p-8 md:p-10 rounded-xl text-slate-500 w-full max-w-[420px] max-h-[90vh] overflow-y-auto'
                >

                    <h1 className='text-center text-xl sm:text-2xl text-neutral-700 font-medium'>{state}</h1>

                    <p className='text-sm text-center'>Welcome back! Please sign in to continue</p>

                    {state !== 'Login' &&
                        <div className='border px-4 sm:px-6 py-2 flex items-center gap-2 rounded-full mt-5 w-full'>
                            <img src={assets.user_icon} alt="" className='w-4 sm:w-5' />
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type="text"
                                className='outline-none text-sm w-full min-w-0'
                                placeholder='Full Name'
                                required
                            />
                        </div>
                    }

                    <div className='border px-4 sm:px-6 py-2 flex items-center gap-2 rounded-full mt-4 w-full'>
                        <img src={assets.email_icon} alt="" className='w-4 sm:w-5' />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            className='outline-none text-sm w-full min-w-0'
                            placeholder='Email id'
                            required
                        />
                    </div>

                    <div className='border px-4 sm:px-6 py-2 flex items-center gap-2 rounded-full mt-4 w-full'>
                        <img src={assets.lock_icon} alt="" className='w-4 sm:w-5' />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            className='outline-none text-sm w-full min-w-0'
                            placeholder='Password'
                            required
                        />
                    </div>

                    {state === 'Login' &&
                        <p
                            onClick={() => setShowForgot(true)}
                            className='text-sm text-blue-600 my-4 cursor-pointer'
                        >
                            Forgot password?
                        </p>
                    }

                    <button
                        type='submit'
                        className='bg-blue-600 w-full text-white py-2 rounded-full mt-2'
                    >
                        {state === 'Login' ? 'login' : 'create account'}
                    </button>

                    {state === 'Login'
                        ? <p className='mt-5 text-center text-sm'>
                            Don't have an account?
                            <span
                                className='text-blue-600 cursor-pointer'
                                onClick={() => setState('Sign Up')}
                            >
                                {' '}Sign up
                            </span>
                        </p>
                        : <p className='mt-5 text-center text-sm'>
                            Already have an account?
                            <span
                                className='text-blue-600 cursor-pointer'
                                onClick={() => setState('Login')}
                            >
                                {' '}Login
                            </span>
                        </p>
                    }

                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt=""
                        className='absolute top-4 right-4 sm:top-5 sm:right-5 cursor-pointer w-4 sm:w-5'
                    />

                </form>
                :
                <form
                    onSubmit={onForgotSubmit}
                    className='relative bg-white p-6 sm:p-8 md:p-10 rounded-xl text-slate-500 w-full max-w-[420px]'
                >
                    <h1 className='text-center text-xl sm:text-2xl text-neutral-700 font-medium'>Reset Password</h1>
                    <p className='text-sm text-center mt-2'>Enter your email and we'll send you a reset link.</p>

                    <div className='border px-4 sm:px-6 py-2 flex items-center gap-2 rounded-full mt-5 w-full'>
                        <img src={assets.email_icon} alt="" className='w-4 sm:w-5' />
                        <input
                            onChange={(e) => setForgotEmail(e.target.value)}
                            value={forgotEmail}
                            type="email"
                            className='outline-none text-sm w-full min-w-0'
                            placeholder='Email id'
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        className='bg-blue-600 w-full text-white py-2 rounded-full mt-6'
                    >
                        Send Reset Link
                    </button>

                    <p
                        onClick={() => setShowForgot(false)}
                        className='mt-5 text-center text-sm text-blue-600 cursor-pointer'
                    >
                        Back to login
                    </p>

                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt=""
                        className='absolute top-4 right-4 sm:top-5 sm:right-5 cursor-pointer w-4 sm:w-5'
                    />
                </form>
            }

        </div>
    )
}

export default Login