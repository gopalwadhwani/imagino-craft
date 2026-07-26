import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const ResetPassword = () => {

  const { token } = useParams()
  const { resetPassword, navigate } = useContext(AppContext)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setLoading(true)
    const success = await resetPassword(token, password)
    setLoading(false)

    if (success) {
      setDone(true)
      setTimeout(() => navigate('/'), 2000)
    }
  }

  return (
    <div className='min-h-[90vh] flex items-center justify-center px-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-xl w-full max-w-[420px] shadow-sm border'
      >
        <h1 className='text-center text-2xl font-medium text-neutral-700 mb-2'>Set New Password</h1>

        {!done ?
          <>
            <p className='text-sm text-center text-gray-500 mb-6'>Enter a new password for your account.</p>

            <div className='border px-4 py-2 flex items-center rounded-full mb-4'>
              <input
                type='password'
                placeholder='New password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className='outline-none text-sm w-full'
              />
            </div>

            <div className='border px-4 py-2 flex items-center rounded-full mb-6'>
              <input
                type='password'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className='outline-none text-sm w-full'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className={`bg-blue-600 w-full text-white py-2 rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
          :
          <p className='text-center text-green-600 text-sm mt-4'>
            Password reset successful! Redirecting you to login...
          </p>
        }
      </form>
    </div>
  )
}

export default ResetPassword