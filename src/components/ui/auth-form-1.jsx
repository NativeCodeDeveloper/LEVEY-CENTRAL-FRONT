import { SignIn } from "@clerk/nextjs";

export function Auth() {
  return (
    <div className="w-full min-w-0 text-sidebar-text">
      <div className="mx-auto mb-8 text-center sm:mb-9">
        <p className="m-0 text-[11px] leading-5 font-semibold uppercase tracking-[0.22em] text-[#a4a0ba] sm:text-base sm:leading-6 sm:tracking-[0.28em]">
          Control calidad laboratorio
        </p>
        <h2 className="m-0 mt-2 text-[36px] leading-[1.15] font-semibold tracking-[-0.045em] text-white sm:text-[44px]">
          Inicia sesión
        </h2>
        <p className="mx-auto mb-0 mt-4 max-w-[460px] text-base leading-[1.5] text-[#8c8c91] sm:text-lg">
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
            main: "w-full! gap-6!",
            form: "w-full! gap-6!",
            formFieldRow: "w-full!",
            formField: "gap-3!",
            formFieldLabelRow: "mb-0!",
            formFieldLabel: "m-0! text-base! leading-6! font-medium! text-[#c6c6cc]! sm:text-lg!",
            formFieldInput: "h-[60px]! min-h-[60px]! max-h-none! w-full! rounded-2xl! border-0! bg-white/[0.07]! px-[22px]! py-0! text-base! text-white! shadow-none! placeholder:text-[#707078]! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-white/60! sm:text-lg!",
            formFieldAction: "text-white/70! hover:text-white!",
            formButtonPrimary: "m-0! flex! h-[68px]! min-h-[68px]! max-h-none! w-full! items-center! justify-center! gap-3! rounded-[17px]! border-0! bg-white! px-6! py-0! text-lg! font-semibold! normal-case! text-[#101116]! shadow-[0_12px_32px_rgba(255,255,255,0.08)]! transition-colors hover:bg-[#ededf0]! focus-visible:outline-2! focus-visible:outline-offset-4! focus-visible:outline-white! [&_svg]:h-3! [&_svg]:w-3! [&_svg]:opacity-60!",
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
