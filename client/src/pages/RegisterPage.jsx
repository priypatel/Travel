import { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import Logo from '../components/Logo';
import { registerSchema } from '../validators/auth.validator';
import FormField from '../components/FormField';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirm: '' },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      dispatch(register({ name: values.name, email: values.email, password: values.password }));
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="w-12 h-12 shadow-lg rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Create your account</h1>
          <p className="text-[#6B7280] text-sm mt-1">Start exploring the world today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* API error banner */}
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <FormField
              label="Full name"
              name="name"
              type="text"
              placeholder="John Doe"
              formik={formik}
            />
            <FormField
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              formik={formik}
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              formik={formik}
            />
            <FormField
              label="Confirm password"
              name="confirm"
              type="password"
              placeholder="••••••••"
              formik={formik}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="px-3 text-xs text-[#6B7280]">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-[#6B7280]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-xs text-[#6B7280] mt-6">
          Discover your next adventure with AI-powered recommendations
        </p>
      </div>
    </div>
  );
}
