import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

// Typy dla stanu komponentu
interface LoginFormState {
  email: string;
  password: string;
  loading: boolean;
  message: string;
  remember: boolean;
}

const LoginForm: React.FC = () => {
  const [state, setState] = useState<LoginFormState>({
    email: "",
    password: "",
    loading: false,
    message: "",
    remember: false,
  });

  const navigate = useNavigate();

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      email: e.target.value,
    }));
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      password: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setState({
      ...state,
      message: "",
      loading: true,
    });

    try {
      // Autoryzacja
      await AuthService.login(state.email, state.password);

      // Nawigacja po zalogowaniu
      navigate("/shop");
      window.location.reload();
    } catch (error: any) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      setState({
        ...state,
        loading: false,
        message: resMessage,
      });
    }
  };

  return (
    <div className="flex text-white h-screen">
      <div className="flex w-1/2 items-center justify-center ">
        <img className=" w-2/3 h-auto" src="/luna_logo_circle.png" alt="Luna Logo" />
      </div>

      <div className="flex w-1/2 items-center justify-center">
        <form className="flex-row bg-[#A3A3A3] bg-opacity-20 m-4 p-10 rounded-md w-1/2" onSubmit={handleLogin}>
          <p className="text-4xl mb-4">Log in</p>

          <label htmlFor="email">Email:</label>
          <div>
            <input
              className=" rounded-md text-black h-8 w-3/4 mb-2"
              type="text"
              name="email"
              value={state.email}
              onChange={onChangeEmail}
              required
            />
          </div>

          <label htmlFor="password">Passowrd:</label>
          <div>
            <input
              className=" rounded-md text-black h-8 w-3/4 mb-2"
              type="password"
              id="password"
              name="password"
              value={state.password}
              onChange={onChangePassword}
              required
            />
          </div>

          <div className="mt-2">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={state.remember}
              onChange={() =>
                setState((prevState) => ({
                  ...prevState,
                  remember: !prevState.remember,
                }))
              }
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <div className="flex items-center justify-center">
            <button type="submit" disabled={state.loading} className="bg-gray-900 p-2 rounded-md m-6 pr-10 pl-10">
              {state.loading ? "Logging in..." : "Log In"}
            </button>
          </div>

          {state.message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {state.message}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between ">
            <a href="/register" className="bg-[#302939] rounded-md p-2">Create account</a>
            <a href="/forgotPassword" className="bg-[#302939] rounded-md p-2">Forgot Password</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
