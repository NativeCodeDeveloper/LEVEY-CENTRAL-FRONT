import { SignIn } from "@clerk/nextjs";

export function Auth() {
  return (
    <div className="w-full min-w-0 text-sidebar-text">
      <div className="mx-auto mb-5 text-center">
        <p className="m-0 text-[10px] leading-5 font-semibold uppercase tracking-[0.22em] text-[#a4a0ba] sm:text-xs sm:tracking-[0.26em]">
          Control calidad laboratorio
        </p>
        <h2 className="m-0 mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.045em] text-white sm:text-[32px]">
          Inicia sesión
        </h2>
        <p className="mx-auto mb-0 mt-3 max-w-[380px] text-sm leading-[1.5] text-[#8c8c91] sm:text-[15px]">
          Ingresa tus credenciales para acceder de forma{" "}
          <br className="hidden sm:block" />
          segura a tu laboratorio.
        </p>
      </div>

      <SignIn
        path="/sign-in"
        routing="path"
        fallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
        withSignUp
        appearance={{
          options: {
            elevation: "flush",
          },
          variables: {
            colorPrimary: "#f5f5f7",
            colorPrimaryForeground: "#0b0d10",
            colorNeutral: "#f5f5f7",
            colorForeground: "#f5f5f7",
            colorMutedForeground: "#a1a1a6",
            colorMuted: "#17191f",
            colorBackground: "transparent",
            colorInput: "rgba(255, 255, 255, 0.08)",
            colorInputForeground: "#f5f5f7",
            colorBorder: "rgba(255, 255, 255, 0.08)",
            colorRing: "rgba(255, 255, 255, 0.55)",
            borderRadius: "1.15rem",
            fontFamily: "var(--font-geist-sans)",
          },
          elements: {
            rootBox: "w-full! min-w-0! max-w-none!",
            cardBox: "w-full! min-w-0! max-w-none! rounded-none! border-0! bg-transparent! shadow-none!",
            card: "w-full! min-w-0! max-w-none! gap-0! rounded-none! border-0! bg-transparent! p-0! shadow-none!",
            header: "[.cl-signIn-start_&]:hidden!",
            logoBox: "hidden!",
            main: "w-full! gap-4!",
            form: "w-full! gap-4!",
            formFieldRow: "w-full!",
            formField: "gap-2!",
            formFieldLabelRow: "mb-0!",
            formFieldLabel: "m-0! text-sm! leading-5! font-medium! text-[#c6c6cc]!",
            formFieldInput: "h-11! min-h-11! max-h-none! w-full! rounded-xl! border-0! bg-white/[0.07]! px-4! py-0! text-base! text-white! shadow-none! placeholder:text-[#707078]! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-white/60!",
            formFieldAction: "text-white/70! hover:text-white!",
            formButtonPrimary: "m-0! flex! h-12! min-h-12! max-h-none! w-full! items-center! justify-center! gap-3! rounded-xl! border-0! bg-white! px-5! py-0! text-base! font-semibold! normal-case! text-[#101116]! shadow-[0_12px_32px_rgba(255,255,255,0.08)]! transition-colors hover:bg-[#ededf0]! focus-visible:outline-2! focus-visible:outline-offset-4! focus-visible:outline-white! [&_svg]:h-3! [&_svg]:w-3! [&_svg]:opacity-60!",
            socialButtonsBlockButton: "border-white/10! bg-white/5! text-white! hover:bg-white/10!",
            socialButtonsBlockButtonText: "text-white!",
            footer: "mt-4! bg-transparent! p-0! [&:not(:has(.cl-footerAction))]:hidden!",
            footerActionText: "text-white/45!",
            footerActionLink: "text-white! hover:text-white/75!",
          },
        }}
      />
    </div>
  );
}

export default Auth;
