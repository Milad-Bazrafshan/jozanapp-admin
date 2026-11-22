import type { ReactNode } from 'react'

const variants = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
  secondary: 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  icon?: ReactNode
}

export function Button({ variant = 'primary', className = '', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
