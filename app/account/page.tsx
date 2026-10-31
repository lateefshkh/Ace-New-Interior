'use client';

import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import {
  Building2,
  LogOut,
  Lock,
  ShieldCheck,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { useDashboardAuth } from '@/hooks/use-dashboard-auth';

export default function AccountPage() {
  const { authenticated, password, setPassword, error, isVerifying, login, logout } =
    useDashboardAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background text-primary">
      <SiteNav />

      <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto max-w-container-max">
          {!authenticated ? (
            <div className="mx-auto max-w-md my-12 border border-primary/10 bg-surface p-8 md:p-12 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/5 rounded-full mb-4 border border-secondary/20">
                  <Lock className="w-6 h-6 text-secondary" />
                </div>
                <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                  Account Access
                </h1>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                  Enter your admin password to manage properties and client inquiries.
                </p>
              </div>

              <form onSubmit={login} className="space-y-6">
                <div>
                  <label className="block text-xs font-label-sm uppercase tracking-widest text-primary mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full bg-background border border-primary/20 px-4 py-3 text-body-md focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs font-body-md text-red-600 bg-red-50 border border-red-200 p-3 text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-primary text-on-primary py-4 font-label-sm text-xs uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {isVerifying ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            </div>
          ) : (
            <div className="my-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-primary/10 pb-8 mb-12 gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-700 border border-green-500/20 text-xs font-label-sm uppercase tracking-widest mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Administrator
                  </span>
                  <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary">
                    Management Portal
                  </h1>
                  <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                    Access client inquiries and property management tools.
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary/20 bg-surface hover:bg-red-600 hover:text-white transition-colors font-label-sm text-xs uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Link
                  href="/dashboard"
                  className="group flex flex-col justify-between border border-primary/10 bg-surface p-8 hover:border-secondary transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-primary/5 text-secondary border border-secondary/20">
                        <Inbox className="w-8 h-8" />
                      </div>
                      <span className="font-label-sm text-xs uppercase tracking-widest text-primary/40 group-hover:text-secondary">
                        Client Operations
                      </span>
                    </div>

                    <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary group-hover:text-secondary transition-colors mb-3">
                      Client Inquiries Dashboard
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
                      View and track consultations, contact details, and chat-sourced leads.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-label-sm uppercase tracking-widest text-primary group-hover:text-secondary pt-4 border-t border-primary/10">
                    Open Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/admin/properties"
                  className="group flex flex-col justify-between border border-primary/10 bg-surface p-8 hover:border-secondary transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-primary/5 text-secondary border border-secondary/20">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <span className="font-label-sm text-xs uppercase tracking-widest text-primary/40 group-hover:text-secondary">
                        Inventory Control
                      </span>
                    </div>

                    <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary group-hover:text-secondary transition-colors mb-3">
                      Property Admin Manager
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
                      Add listings, upload imagery, and update prices and availability.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-label-sm uppercase tracking-widest text-primary group-hover:text-secondary pt-4 border-t border-primary/10">
                    Open Property Manager <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
