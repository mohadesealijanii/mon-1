import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

export const isTokenValid = (navigate) => {
  const token = Cookies.get("authToken")
  if (!token) {
    return false
  }

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    if (decoded.exp && decoded.exp < currentTime) {
      toast.error("Session expired!")
      navigate("/signin")
      return false
    }

    return true
  } catch (error) {
    console.log(error)
    toast.error("Invalid token!")
    navigate("/signin")
    return false
  }
}
