import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { UserAuthContext } from '../context/UserAuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const UserLogin = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { register, login, loading } = useContext(UserAuthContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if (state === 'Login') {
        const result = await login(email, password)
        if (result.success) {
          toast.success('Login successful')
          onClose()
          navigate('/applications')
        } else {
          toast.error(result.message)
        }
      } else {
        // Register
        const result = await register(name, email, password)
        if (result.success) {
          toast.success('Registration successful')
          setState('Login')
          setName('')
          setEmail('')
          setPassword('')
        } else {
          toast.error(result.message)
        }
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred')
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-20 backdrop-blur-sm bg-black/40 flex justify-center items-center p-4'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-8 sm:p-12 rounded-2xl text-slate-600 w-full max-w-md shadow-2xl'>

        <h1 className='text-center text-3xl font-bold mb-8 text-gray-800'>
          User {state}
        </h1>

        <img 
          onClick={onClose} 
          className='absolute top-6 right-6 cursor-pointer w-6 h-6 hover:scale-110 transition' 
          src={assets.cross_icon} 
          alt="Close" 
        />

        <div className='space-y-4'>
          {state !== 'Login' && (
            <input 
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition' 
              onChange={e => setName(e.target.value)} 
              value={name} 
              placeholder='Full Name' 
              required 
            />
          )}
          
          <input 
            className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition' 
            onChange={e => setEmail(e.target.value)} 
            value={email} 
            type="email" 
            placeholder='Email' 
            required 
          />
          
          <input 
            className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition' 
            onChange={e => setPassword(e.target.value)} 
            value={password} 
            type="password" 
            placeholder='Password' 
            required 
          />
        </div>

        <button 
          className='w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 disabled:opacity-50'
          disabled={loading}
        >
          {loading ? 'Please wait...' : (state === 'Login' ? 'Login' : 'Register')}
        </button>

        <p className='text-center mt-6 text-gray-600'>
          {state === 'Login' ? "Don't have an account?" : "Already have an account?"}
          <span 
            onClick={() => {
              setState(state === 'Login' ? 'Sign Up' : 'Login')
              setName('')
              setEmail('')
              setPassword('')
            }} 
            className='text-blue-600 font-semibold cursor-pointer ml-2 hover:underline'
          >
            {state === 'Login' ? 'Sign Up' : 'Login'}
          </span>
        </p>

      </form>
    </div>
  )
}

export default UserLogin
