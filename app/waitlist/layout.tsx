import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join Our Waitlist',
  description: 'Sign up for early access and move up the queue by referring friends.',
}

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
