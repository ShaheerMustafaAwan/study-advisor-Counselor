import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <section
        className="relative flex min-h-[42vh] lg:min-h-screen items-center justify-center text-white overflow-hidden bg-slate-900 bg-cover bg-center"
        style={{ backgroundImage: "url(/login.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/65 via-indigo-800/55 to-purple-900/50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-soft-light blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-soft-light blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md text-center px-8 py-10">
          <h1 className="text-4xl font-extrabold drop-shadow-sm">Welcome Back</h1>
          <p className="mt-4 text-white/95 drop-shadow-sm">
            Access your counselor dashboard, track student progress, and review
            applications in one place.
          </p>
          <div className="mt-8 text-sm text-white/90">
            Counselor portal for study abroad advisory workflows.
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900">Counselor Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Use your counselor account to continue.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                required
                autoComplete="username"
                className="rounded-xl border-gray-300 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                required
                autoComplete="current-password"
                className="rounded-xl border-gray-300 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              variant="gradient"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
