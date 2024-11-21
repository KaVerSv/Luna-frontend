import React, { useState } from 'react';
import AuthService from '../services/AuthService';

const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email)
    AuthService.passwordReset(email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-[#302939] p-8 rounded-md shadow-md text-center text-white w-full max-w-md">
        <h1 className="text-2xl font-bold">Recover Password</h1>
        
        {/* after submting */}
        {isSubmitted ? (
          <div>
            <p className="mt-4 text-white">
              We have sent instructions for password recovery to your email.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/login'}  // redirect to login
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
              >
                Go to Login
              </button>
            </div>
          </div>
        ) : (
          // form for password recovery
          <form onSubmit={handleSubmit} className="mt-6">
            <input
              type="email"
              className="w-full p-3 mb-4 rounded-md bg-[#4A3C5C] text-white"
              placeholder="your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecoverPassword;
