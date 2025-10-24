"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { SVGProps } from "react";

const StackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <path d="m9 1 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8z"/>
  </svg>
);

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

export default function UsernameForm({ userId, userEmail }: { userId: string; userEmail: string | null | undefined }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkUsername = useCallback(
    debounce(async (name: string) => {
      if (name.length < 3) {
        setIsAvailable(null);
        setError("");
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(name)) {
        setIsAvailable(false);
        setError("Username can only contain letters, numbers, and underscores");
        return;
      }

      setIsChecking(true);
      setError("");
      try {
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(name)}`);
        const data = await response.json();
        setIsAvailable(data.available);
        if (!data.available) {
          setError("Username is already taken");
        }
      } catch (err) {
        setError("Error checking username availability");
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (username) {
      checkUsername(username);
    } else {
      setIsAvailable(null);
      setError("");
    }
  }, [username, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !isAvailable || isChecking || username.length < 3) return;

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/");
      } else {
        setError(data.error || "Failed to set username");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
         
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4">
              <StackIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Your Username
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {userEmail && `Welcome, ${userEmail.split('@')[0]}! `}
              Pick a unique username for your Stak page
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
                    isAvailable === false ? "border-red-500 focus:ring-red-500 focus:border-red-500" : 
                    isAvailable === true ? "border-green-500 focus:ring-green-500 focus:border-green-500" : 
                    "border-gray-300 dark:border-gray-600"
                  }`}
                  id="username"
                  type="text"
                  placeholder="your-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, ''))}
                  minLength={3}
                  maxLength={30}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isChecking && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  )}
                  {!isChecking && isAvailable === true && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {!isChecking && isAvailable === false && (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="mt-2 min-h-[20px]">
                {isChecking && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Checking availability...</p>
                )}
                {!isChecking && isAvailable === true && (
                  <p className="text-sm text-green-600 dark:text-green-400">✓ Username is available!</p>
                )}
                {!isChecking && error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                {!isChecking && username && username.length < 3 && !error && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Username must be at least 3 characters</p>
                )}
                {!username && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose a unique username (letters, numbers, underscores only)</p>
                )}
              </div>
            </div>

            {username && username.length >= 3 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Stak page will be:</p>
                <p className="font-mono text-indigo-600 dark:text-indigo-400 break-all">
                  stak.bio/{username}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isAvailable || isChecking || isSubmitting || username.length < 3}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                !isAvailable || isChecking || isSubmitting || username.length < 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Creating your page..." : "Create My Stak Page"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can change your username later in settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}