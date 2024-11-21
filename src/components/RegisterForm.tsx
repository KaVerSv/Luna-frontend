import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { isEmail } from 'validator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import AuthService from '../services/AuthService';

interface RegisterData {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  date: string;
}

interface IFormInput {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  date: string;
}

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const navigate = useNavigate();

  const sendRegister = async (data: IFormInput) => {
    console.log("sendRegister function called", data); // Logowanie danych

    if (data.password !== data.confirmedPassword) {
      toast.error('Confirmed password must match the password.');
      return;
    }

    const registerData: RegisterData = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
      username: data.username,
      date: data.date,
    };

    try {
      await AuthService.register(registerData);
      navigate('/checkEmail'); // Redirigowanie po udanej rejestracji
    } catch (error: any) {
      const resMessage =
        (error.response?.data?.message) ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(resMessage); // Wyświetlanie błędu
    }
  };

  // Zmieniamy obsługę formularza: używamy onSubmit bezpośrednio, aby pozbyć się zależności od handleSubmit.
  const onSubmit = (data: IFormInput) => {
    console.log("Form submitted", data);  // Logowanie danych formularza
    sendRegister(data);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <ToastContainer />
      <div className="flex w-1/2">
        <img className="w-2/3" src="/luna_logo_circle.png" alt="Luna Logo" />
      </div>
      <div className="bg-[#A3A3A3] bg-opacity-20 w-1/3 p-8 rounded-md">
        <p className="text-white text-4xl mb-8">Register</p>
        <form onSubmit={(e) => {
          e.preventDefault(); // Zatrzymujemy domyślne wysyłanie formularza
          const formData = {
            name: e.target.name.value,
            surname: e.target.surname.value,
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            confirmedPassword: e.target.confirmedPassword.value,
            date: e.target.date.value,
          };
          onSubmit(formData); // Wywołanie funkcji onSubmit
        }} className="space-y-2">
          <div>
            <label htmlFor="username" className="text-white block mb-2">Username:</label>
            <input
              id="username"
              {...register('username', { required: 'Username is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="text-white block mb-2">Email:</label>
            <input
              id="email"
              {...register('email', {
                required: 'Email is required',
                validate: value => isEmail(value) || 'This is not a valid email'
              })}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="name" className="text-white block mb-2">Name:</label>
            <input
              id="name"
              {...register('name', { required: 'Name is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="surname" className="text-white block mb-2">Surname:</label>
            <input
              id="surname"
              {...register('surname', { required: 'Surname is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {errors.surname && <p className="text-red-500 text-sm">{errors.surname.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="text-white block mb-2">Password:</label>
            <input
              id="password"
              {...register('password', { required: 'Password is required', minLength: 6 })}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmedPassword" className="text-white block mb-2">Repeat Password:</label>
            <input
              id="confirmedPassword"
              {...register('confirmedPassword', { required: 'Please confirm your password' })}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {errors.confirmedPassword && <p className="text-red-500 text-sm">{errors.confirmedPassword.message}</p>}
          </div>

          <div>
            <label htmlFor="date" className="text-white block mb-2">Date of Birth:</label>
            <input
              id="date"
              {...register('date', { required: 'Date of birth is required' })}
              type="date"
              min="1930-01-01"
              max="2024-12-31"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
          </div>

          <div className="flex justify-center mt-6">
            <button type="submit" className="mt-4 px-6 py-2 bg-[#302939] text-white rounded-lg">Register</button>
          </div>
        </form>
        <div className="mt-6 text-center text-white">
          <Link to="/login">I already have an account</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
