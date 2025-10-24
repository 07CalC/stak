import { auth } from '@/auth';
import { SignIn } from '@/components/buttons/SignIn';
import { redirect } from 'next/navigation';
import { SVGProps } from 'react';

const StackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <path d="m9 1 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8z"/>
  </svg>
);

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
     
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4">
              <StackIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Stak
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your personal link-in-bio page
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <SignIn provider="google" redirectTo='/username' />
            <SignIn provider="github" redirectTo='/username' />
          </div>


          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
