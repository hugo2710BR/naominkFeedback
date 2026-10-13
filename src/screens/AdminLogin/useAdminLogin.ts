import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/api/adminApi";

export function useAdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginError = await login(password);
    if (loginError) {
      setError(loginError);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return {
    password,
    error,
    loading,
    submitDisabled: loading || password.length === 0,
    handlePasswordChange,
    handleSubmit,
  };
}
