import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070708] px-4">

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.12] blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-sky-500/[0.07] blur-[70px]" />

      {/* Logo */}
      {/* <Link href="/" className="flex items-center gap-2.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] group-hover:-rotate-12">
            <Rocket className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <span className="font-display text-[1.2rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            PrepPath
          </span>
      </Link> */}
      

      {/* Clerk SignUp — appearance overrides to match theme */}
      <div className="relative z-10">
        <SignUp
          appearance={{
            variables: {
              colorBackground:       '#13131a',
              colorInputBackground:  '#0d0d10',
              colorText:             '#f0f0f4',
              colorTextSecondary:    'rgba(255,255,255,0.35)',
              colorPrimary:          '#7c3aed',
              colorInputText:        '#f0f0f4',
              colorNeutral:          '#f0f0f4',
              borderRadius:          '12px',
              fontFamily:            'inherit',
            },
            elements: {
              card:                  'shadow-[0_0_0_1px_rgba(255,255,255,0.07)] bg-[#13131a]',
              headerTitle:           'text-white font-display font-extrabold tracking-tight',
              headerSubtitle:        'text-white/35',
              socialButtonsBlockButton: 'border border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06] transition-colors',
              socialButtonsBlockButtonText: 'text-white/70',
              dividerLine:           'bg-white/[0.06]',
              dividerText:           'text-white/20',
              formFieldLabel:        'text-white/50 text-xs tracking-wide',
              formFieldInput:        'bg-[#0d0d10] border border-white/[0.08] text-white placeholder-white/20 focus:border-violet-500/50 focus:ring-0 rounded-xl',
              formButtonPrimary:     'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-sky-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)]',
              footerActionLink:      'text-violet-400 hover:text-violet-300',
              identityPreviewText:   'text-white/60',
              identityPreviewEditButton: 'text-violet-400',
              otpCodeFieldInput:     'border border-white/[0.08] bg-[#0d0d10] text-white rounded-xl',
              alertText:             'text-white/60',
              formResendCodeLink:    'text-violet-400',
            },
          }}
        />
      </div>
    </div>
  )
}