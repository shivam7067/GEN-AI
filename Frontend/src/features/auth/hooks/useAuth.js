import { useContext ,useEffect} from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getme } from "../services/auth.api"

export const useAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setLoading } = context

  const handleLogin = async ({ email, password }) => {
    setLoading(true)
    try {
      const data = await login({ email, password })
      setUser(data.user)
    } catch (err) {
       console.log(err)
    } finally {
      setLoading(false)

    }
  }
  const handleRegister = async ({ username, email, password }) => {
    setLoading(true)
    try {
      const data = await register({ username, email, password })
      setUser(data.user)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }


  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      setUser(null)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const data = await getme()
        setUser(data.user)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [ ])

  return { user, loading, handleLogin, handleRegister, handleLogout ,}
}