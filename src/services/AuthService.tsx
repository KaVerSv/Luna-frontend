import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth/";

// Typy danych
interface LoginResponse {
  token: string;
  [key: string]: any; // Jeśli odpowiedź może mieć inne pola
}

interface RegisterData {
  name: string;
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

  // Rejestracja użytkownika
  async register(data: RegisterData): Promise<void> {
    await axios.post(`${API_URL}register`, data);
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
}

export default new AuthService();
