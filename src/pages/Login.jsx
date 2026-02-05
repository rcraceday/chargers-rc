import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      window.location.href = "/dashboard"
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 20 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: 20 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, width: "100%" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  )
}
