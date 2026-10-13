"use client";

import { Spinner } from "@/components/Spinner/Spinner";
import { SITE } from "@/config/site";
import { useAdminLogin } from "@/screens/AdminLogin/useAdminLogin";

export function AdminLogin() {
  const { password, error, loading, submitDisabled, handlePasswordChange, handleSubmit } =
    useAdminLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-nmk-bg px-6 py-10">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-[22px] text-center">
        <div className="flex flex-col items-center gap-1.5">
          <div className="font-display text-[26px] italic">{SITE.brand}</div>
          <h1 className="m-0 text-[11px] font-normal uppercase tracking-[0.18em] text-nmk-text-muted">
            Área reservada
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3.5 text-left">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.1em] text-nmk-text-secondary">
              Palavra-passe
            </span>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              aria-invalid={!!error}
              aria-describedby={error ? "admin-password-error" : undefined}
              autoFocus
              className={`w-full rounded-input border bg-nmk-elevated-2 px-3.5 py-3 font-ui text-sm text-nmk-text placeholder:text-nmk-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-nmk-text disabled:opacity-60 ${
                error ? "border-[oklch(0.62_0.19_25/0.6)]" : "border-nmk-border"
              }`}
            />
          </label>
          {error && (
            <p id="admin-password-error" role="alert" className="m-0 text-xs leading-normal text-nmk-danger-soft">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitDisabled}
            className="mt-1 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border-none bg-nmk-accent py-3.5 text-[13px] font-medium tracking-[0.04em] text-nmk-accent-ink disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nmk-text"
          >
            {loading && <Spinner variant="dark" />}
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
