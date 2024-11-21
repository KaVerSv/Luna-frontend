import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth/";
const API_URL_reset = "http://localhost:8080/forgotPassword/";

// Typy danych
interface LoginResponse {
  token: string;
  [key: string]: any; // Jeśli odpowiedź może mieć inne pola
}

interface RegisterData {
  firstName: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}

interface User {
  token: string;
  [key: string]: any; // Opcjonalnie, jeśli przechowujesz więcej danych o użytkowniku
}

class AuthService {
  // Logowanie użytkownika
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${API_URL}authenticate`, {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  }

  // Wylogowanie użytkownika
  async logout(): Promise<void> {
    try {
      localStorage.removeItem("user");
      localStorage.clear();
      await axios.post(`${API_URL}logout`);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async register(registerData: RegisterData) {
    try {
      // Przykład: wywołanie API
      const response = await axios.post(`${API_URL}register`, registerData);
      return response; // Zwracamy całą odpowiedź, która zawiera 'data'
    } catch (error) {
      throw error; // Rzucamy wyjątek w przypadku błędu
    }
  }

  // Pobranie aktualnego użytkownika
  getCurrentUser(): User | null {
    const userString = localStorage.getItem("user");
    return userString ? (JSON.parse(userString) as User) : null;
  }

    // Sprawdzenie, czy użytkownik jest zalogowany
    isLogged(): boolean {
      const user = this.getCurrentUser();
      if (!user) {
        return false;
      } else {
        return true;
      }
    }

  // Sprawdzenie, czy użytkownik jest zalogowany
  ensureAuthenticated(): void {
    const user = this.getCurrentUser();
    if (!user) {
      // Przekierowanie na stronę logowania
      window.location.href = "/login";
    }
  }

  async passwordReset(email: string) {
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await axios.post(`${API_URL_reset}passwordRecoveryRequest/${encodedEmail}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async postPasswordReset(password: string, repeatedPassword: string): Promise<void> {
    try {
      // Odczytanie OTP z adresu URL
      const urlParams = new URLSearchParams(window.location.search);
      const otp = urlParams.get("otp");
  
      if (!otp) {
        throw new Error("OTP not found in the URL.");
      }
  
      // Przygotowanie danych do wysłania w ciele żądania
      const data = {
        password,
        repeatedPassword,
      };
  
      // Wysłanie żądania POST z OTP w nagłówku
      const response = await axios.post(`${API_URL_reset}changePassword`, data, {
        headers: {
          "X-OTP": otp, // Dodanie OTP do nagłówka
        },
      });
  
      console.log("Password reset successful:", response.data);
    } catch (error) {
      console.error("Error during password reset:", error);
      throw error; // Rzucamy błąd, aby aplikacja mogła go obsłużyć
    }
  }
  
}

export default new AuthService();
