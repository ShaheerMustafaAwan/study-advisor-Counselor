import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "@/api/auth";
import {
  clearAuthToken,
  decodeAuthToken,
  getAuthToken,
  isTokenExpired,
  setAuthToken,
} from "@/api/http";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existingToken = getAuthToken();
    const payload = decodeAuthToken(existingToken);

    if (
      existingToken &&
      payload &&
      String(payload.role || "").toLowerCase() === "counselor" &&
      !isTokenExpired(payload)
    ) {
      navigate("/", { replace: true });
      return;
    }

    if (existingToken) {
      clearAuthToken();
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email.trim(), password);
      const role = String(response.user?.role || "").toLowerCase();

      if (role !== "counselor") {
        setError("This login is only for counselors.");
        return;
      }

      setAuthToken(response.token);

      const state = location.state as LocationState | null;
      const redirectTo = state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-card">
        <h1 className="text-2xl font-bold tracking-tight">Counselor Login</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in with credentials provided by admin.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
