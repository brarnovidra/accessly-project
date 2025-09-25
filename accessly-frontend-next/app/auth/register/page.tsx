'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../../../services/auth'
import { api } from '../../../services/api'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { IMembershipResource } from '../../../types/membership/membership'

interface FormData {
  email: string,
  password: string,
  membershipId: string
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email is not valid')
    .required('Email is required'),
  membershipId: yup.string()
  .required('Membership is required'),
  password: yup.string()
    .trim()
    .required('Password is required'),
  confirm: yup.string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm password is required')
});

const defaultValues = {
  email: '',
  membershipId: '',
  password: '',
  confirm: '',
}

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [memberships, setMemberships] = useState<IMembershipResource[]>([])

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

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      try {
        const membership = await api.get('/memberships')
        setMemberships(membership.data)

        setLoading(false)
      } catch (error) {

      }
    }
    getData()

  }, [])


  const onSubmit = async (data: FormData) => {
    const { email, password, membershipId } = data
    try {
      const res = await authService.register(email, password, Number(membershipId))

      router.push('/auth/login')
    } catch (err: any) {
      setError('password', {
        type: 'manual',
        message: err
      })
    } finally {
      //
    }
  }

  const handleGoogleSignUp = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/google`;
  };

  const handleFacebookSignUp = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/facebook`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <span className="text-3xl font-bold text-indigo-600">~</span>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Sign up
        </h2>

        {/* Form */}
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700">
              Membership
            </label>
            <Controller
              control={control}
              name="membershipId"
              render={({ field }) => (
                <select
                  {...field}
                  id="membershipId"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.membershipId ? 'border-red-600' : ''
                    }`}
                >
                  <option value="">-- Select Membership --</option>
                  {memberships.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.type}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.membershipId && (
              <p className="mt-1 text-sm text-red-600">{errors.membershipId.message}</p>
            )}
          </div>

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

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Controller
              control={control}
              name="confirm"
              render={({ field }) => (
                <input
                  {...field}
                  id="confirm"
                  type="password"
                  autoComplete="current-password"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm
                ${errors.confirm ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
              `}
                />
              )}
            />
            {errors.confirm && (
              <p className="mt-1 text-sm text-red-600">{errors.confirm.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
            disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Sign up'}
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
            onClick={handleGoogleSignUp}
            className="h-[50px] flex-1 flex items-center justify-center space-x-2 border rounded-md px-4 shadow-sm hover:bg-gray-50"
          >
            <img src="/google.svg" alt="Google" className="w-6 h-6" />
            <span className="font-medium">Google</span>
          </button>

          <button
            type="button"
            onClick={handleFacebookSignUp}
            className="h-[50px] flex-1 flex items-center justify-center space-x-2 border rounded-md px-4 shadow-sm hover:bg-gray-50"
          >
            <img src="/fb.svg" alt="Facebook" className="w-6 h-6" />
            <span className="font-medium">Facebook</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline font-medium">
            Log in
          </a>
        </p>

      </div>
    </div >
  );
}
