import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RecruiterLogin = () => {

  const navigate = useNavigate()

  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState(null)
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

  const {
    setShowRecruiterLogin,
    backendUrl,
    setCompanyToken,
    setCompanyData
  } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state === "Sign Up" && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true)
    }

    try {
      if (state === "Login") {

        const { data } = await axios.post(
          backendUrl + '/api/company/login',
          { email, password }
        )

        if (data.success) {
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        } else {
          toast.error(data.message)
        }

      } else {

        // Validate all required fields for signup
        if (!name || !email || !password) {
          toast.error('Please fill in all fields')
          return setIsTextDataSubmitted(false)
        }

        if (!image) {
          toast.error('Please upload company logo')
          return
        }

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('image', image)

        const { data } = await axios.post(
          backendUrl + '/api/company/register',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        if (data.success) {
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
          toast.success('Company registered successfully!')
        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.message || 'Registration failed')
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => document.body.style.overflow = 'unset'
  }, [])

  return (
    <div className='fixed inset-0 z-10 backdrop-blur-sm bg-black/40 flex justify-center items-center p-4'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-8 sm:p-12 rounded-2xl text-slate-600 w-full max-w-md shadow-2xl'>

        <h1 className='text-center text-3xl font-bold mb-8 text-gray-800'>
          Recruiter {state}
        </h1>

        <img onClick={() => setShowRecruiterLogin(false)} className='absolute top-6 right-6 cursor-pointer w-6 h-6 hover:scale-110 transition' src={assets.cross_icon} alt="Close" />

        {state === 'Sign Up' && isTextDataSubmitted ? (
          <div className='flex flex-col items-center gap-4 my-8 bg-blue-50 p-6 rounded-lg'>
            <label htmlFor="image" className='cursor-pointer'>
              <img className='w-20 h-20 rounded-full border-2 border-blue-400 hover:border-blue-600 transition' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload" />
              <input onChange={e => setImage(e.target.files[0])} type="file" hidden id="image" />
            </label>
            <p className='text-center font-medium text-gray-700'>Upload Company logo</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {state !== 'Login' && (
              <input 
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition' 
                onChange={e => setName(e.target.value)} 
                value={name} 
                placeholder='Company Name' 
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
        )}

        <button className='w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300'>
          {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next'}
        </button>

        <p className='text-center mt-6 text-gray-600'>
          {state === 'Login' ? "Don't have an account?" : "Already have an account?"}
          <span 
            onClick={() => { setState(state === 'Login' ? 'Sign Up' : 'Login'); setIsTextDataSubmitted(false) }} 
            className='text-blue-600 font-semibold cursor-pointer ml-2 hover:underline'
          >
            {state === 'Login' ? 'Sign Up' : 'Login'}
          </span>
        </p>

      </form>
    </div>
  )
}

export default RecruiterLogin