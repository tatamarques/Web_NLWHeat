import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";


type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}
export const AuthContext = createContext({} as AuthContextData);

interface AuthResponse {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}
export function AuthProvider(props: AuthProviderProps){

  const [user, setUser] = useState<User | null>(null)

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=e58ef5588dc2a7df018b`

  async function signIn (githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    });

    const { token, user } = response.data;

    
    localStorage.setItem('@dowile:token', token)
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    setUser(user);
  }

  function signOut(){
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
  
    const token = localStorage.getItem('@dowhile:token')

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      api.get<User>('profile').then(response => {
        setUser(response.data);
      })
    }
  }, [])

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, [])
  return(
    <AuthContext.Provider value={{signInUrl, user, signOut}}>
      {props.children}
    </AuthContext.Provider>
  )
}