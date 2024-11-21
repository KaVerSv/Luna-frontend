import React, { useState } from 'react';
import AuthService from '../services/AuthService';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sprawdzamy, czy hasła są takie same
    if (password !== confirmPassword) {
      setMessage('Hasła się nie zgadzają. Spróbuj ponownie.');
      return;
    }

    try {
      // Wywołanie metody AuthService do wysłania danych
      await AuthService.postPasswordReset(password, confirmPassword);

      // Sukces - ustawiamy odpowiedni komunikat i zmieniamy stan
      setMessage('Hasło zostało pomyślnie zresetowane.');
      setIsSubmitted(true);
    } catch (error) {
      // Obsługa błędów
      console.error(error);
      setMessage('Wystąpił błąd podczas resetowania hasła. Spróbuj ponownie.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-[#302939] p-8 rounded-md shadow-md text-center text-white w-full max-w-md">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>

        {/* Formularz resetowania hasła */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <input
                type="password"
                className="w-full p-3 rounded-md bg-[#4A3C5C] text-white"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full p-3 rounded-md bg-[#4A3C5C] text-white"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className="mt-2 text-red-500">{message}</p>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Reset Password
            </button>
          </form>
        ) : (
          // Komunikat po udanym zresetowaniu hasła
          <div>
            <p className="mt-4 text-white">
              Your password has been successfully reset.
            </p>
            <div className="mt-6">
              <button
                onClick={() => (window.location.href = '/login')} // Możliwość przejścia do strony logowania
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
