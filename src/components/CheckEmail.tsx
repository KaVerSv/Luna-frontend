import React from 'react';

const CheckEmail: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-[#302939] p-8 rounded-md shadow-md text-center text-white">
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="mt-4 text-white">
          Account created! We've sent you an email with a link to activate your account. Please check your inbox.
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;