import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()


  const signup = async (signupInputs) => {
    try {
        setLoading(true)
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupInputs),
        })
        const data = await response.json()
        if (response.ok) {
            setAuthUser(data)
            console.log("User signed up successfully:", data);
        } else {
            throw new Error(data.error)
        }

    } catch (error) {
        console.log(error);
    }finally {
        setLoading(false)
    }
  }

  return { signup, loading }

}

export default useSignup