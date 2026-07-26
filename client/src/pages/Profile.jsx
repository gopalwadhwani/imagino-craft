import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Profile = () => {

  const { getUserProfile, navigate, forgotPassword } = useContext(AppContext)
  const [profile, setProfile] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    setLoading(true)
    const data = await getUserProfile()
    if (data) {
      setProfile(data.user)
      setTransactions(data.transactions)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleChangePassword = async () => {
    if (profile) {
      await forgotPassword(profile.email)
    }
  }

  const formatDate = (dateVal) => {
    return new Date(dateVal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return <p className='text-center mt-20 text-gray-500'>Loading...</p>
  }

  if (!profile) {
    return <p className='text-center mt-20 text-gray-500'>Could not load profile.</p>
  }

  return (
    <div className='relative min-h-[80vh] pt-14 mb-10 px-4'>

      <button
        type='button'
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-black bg-white/60 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors'
      >
        ←
      </button>

      <h1 className='text-center text-3xl font-medium mb-10'>My Profile</h1>

      <div className='max-w-md mx-auto bg-white border rounded-xl p-6 mb-8'>
        <div className='flex items-center gap-4 mb-6'>
          <img src={assets.profile_icon} alt="" className='w-16 h-16 rounded-full' />
          <div>
            <p className='text-lg font-medium'>{profile.name}</p>
            <p className='text-sm text-gray-500'>{profile.email}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div className='bg-gray-50 rounded-lg p-3'>
            <p className='text-gray-500'>Credit Balance</p>
            <p className='text-lg font-semibold'>{profile.creditBalance}</p>
          </div>
          <div className='bg-gray-50 rounded-lg p-3'>
            <p className='text-gray-500'>Member Since</p>
            <p className='text-lg font-semibold'>{formatDate(profile.createdAt)}</p>
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          className='w-full mt-6 border border-gray-300 text-gray-700 py-2 rounded-full text-sm hover:bg-gray-50 transition-colors'
        >
          Change Password
        </button>
      </div>

      <div className='max-w-md mx-auto'>
        <h2 className='text-lg font-medium mb-4'>Transaction History</h2>

        {transactions.length === 0 ?
          <p className='text-gray-500 text-sm text-center'>No transactions yet.</p>
          :
          <div className='space-y-2'>
            {transactions.map((tx) => (
              <div key={tx._id} className='flex justify-between items-center bg-white border rounded-lg p-3 text-sm'>
                <div>
                  <p className='font-medium'>{tx.plan} Plan</p>
                  <p className='text-gray-500 text-xs'>{formatDate(tx.date)}</p>
                </div>
                <div className='text-right'>
                  <p className='font-medium'>₹{tx.amount}</p>
                  <p className='text-gray-500 text-xs'>+{tx.credits} credits</p>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

    </div>
  )
}

export default Profile