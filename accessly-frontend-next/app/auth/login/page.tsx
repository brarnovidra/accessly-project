'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../../../services/auth'
import { api } from '../../../services/api'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

interface FormData {
  email: string,
  password: string,
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email is not valid')
    .required('Email is required'),
  password: yup.string()
    .trim()
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-\s]).{8,}$/,
    //   "Password must contain at least 1 lowercase letter \n, 1 uppercase letter, 1 number, and 1 special character or space. It must be at least 8 characters long.")
    .required('Password is required'),
});

const defaultValues = {
  email: '',
  password: '',
}


export default function Login() {
  const router = useRouter()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const { email, password } = data
    try {
      const res = await authService.login(email, password)

      router.push('/dashboard')
    } catch (err: any) {
      setError('password', {
        type: 'manual',
        message: 'Password is invalid'
      })
    } finally {
      //
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/facebook`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <span className="text-3xl font-bold text-indigo-600">~</span>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Sign in to your account
        </h2>

        {/* Form */}
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm
                ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
              `}
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input
                  {...field}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm
                ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
              `}
                />
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>

            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
            disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="flex space-x-10">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="h-[50px] flex-1 flex items-center justify-center space-x-2 border rounded-md px-4 shadow-sm hover:bg-gray-50"
          >
            <img src="/google.svg" alt="Google" className="w-6 h-6" />
            <span className="font-medium">Google</span>
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            className="h-[50px] flex-1 flex items-center justify-center space-x-2 border rounded-md px-4 shadow-sm hover:bg-gray-50"
          >
            <img src="/fb.svg" alt="Facebook" className="w-6 h-6" />
            <span className="font-medium">Facebook</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>

      </div>
    </div >
  );
}
