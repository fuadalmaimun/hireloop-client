"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "@/components/ui/toast"

import { Input } from "@/components/ui/input"

import {
  ArrowLeft,
  CircleHelp,
  CreditCard,
  Link2,
  Lock,
} from "lucide-react"

// Pixel-close mock of the Stripe Checkout hosted page (dark theme).
// The "Pay" button is a placeholder — when Stripe lands, swap its handler
// for a POST to a checkout-session endpoint and redirect to the returned
// Stripe hosted page (see handlePay).

const inputClass =
  "h-10 w-full rounded-lg border-white/10 bg-[#161616] px-3 text-sm text-white placeholder:text-white/35 focus-visible:border-white/30 focus-visible:ring-white/10 sm:h-11"

const sectionLabelClass =
  "font-mono text-[10px] tracking-[0.14em] text-white/45 uppercase"

const USD_PRICE = 20
const BDT_RATE = 127.6666

const countries = [
  "Bangladesh",
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
]

export default function PaymentPage() {
  const [currency, setCurrency] = React.useState<"BDT" | "USD">("BDT")
  const [country, setCountry] = React.useState("Bangladesh")
  const [saveInfo, setSaveInfo] = React.useState(false)
  const [paying, setPaying] = React.useState(false)

  /** "BDT 2,553.33" / "$20.00" — computed so a price change stays consistent. */
  const amount =
    currency === "BDT"
      ? `BDT ${(USD_PRICE * BDT_RATE).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : `$${USD_PRICE.toFixed(2)}`

  async function handlePay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (paying) return
    setPaying(true)

    // TODO(stripe): call the backend to create a Stripe Checkout Session
    // (server action or `POST /api/checkout`), then `window.location.href =
    // session.url` to land on Stripe's hosted payment page. On success,
    // Stripe redirects back to `/payment/success?session_id={CHECKOUT_SESSION_ID}`.
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.add({
        title: "Stripe checkout coming soon",
        description: "You'll be redirected to a secure payment page.",
        type: "success",
      })
    } finally {
      setPaying(false)
    }
  }

  return (
    <main className="flex mt-19 min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Top bar — back + secure lock left, sandbox badge right */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link 
            href="/browse-jobs"
            aria-label="Go back"
            className="flex size-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>

          <span
            aria-label="Secure checkout"
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-[#141414]"
          >
            <Lock className="size-4 text-white/70" aria-hidden="true" />
          </span>
        </div>

        <span className="rounded-md border border-white/15 bg-[#141414] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase">
          Sandbox
        </span>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-10 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        {/* Left column — currency picker + order summary */}
        <section aria-label="Order summary">
          <p className={sectionLabelClass}>Choose a currency:</p>

          <div
            role="radiogroup"
            aria-label="Currency"
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {(
              [
                { code: "BDT", flag: "bd", label: `BDT ${(USD_PRICE * BDT_RATE).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                { code: "USD", flag: "us", label: `$${USD_PRICE.toFixed(2)}` },
              ] as const
            ).map((option) => (
              <button
                key={option.code}
                type="button"
                role="radio"
                aria-checked={currency === option.code}
                onClick={() => setCurrency(option.code)}
                className={
                  "flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-sm font-semibold transition-colors " +
                  (currency === option.code
                    ? "border-white/80 bg-[#141414] text-white"
                    : "border-white/10 bg-[#141414] text-white/75 hover:border-white/30")
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/w40/${option.flag}.png`}
                  alt=""
                  className="h-3.5 w-5 rounded-[2px] object-cover"
                />
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-2 text-[11px] text-white/35">
            1 USD = {BDT_RATE} BDT
          </p>

          {/* Order summary */}
          <div className="mt-8 flex items-start justify-between gap-4">
            <div>
              <p className="font-manrope text-base font-bold sm:text-lg">
                Hireloop Pro Plan
              </p>

              <p className="mt-0.5 text-xs text-white/45">
                Access to all features
              </p>
            </div>

            <p className="font-manrope text-base font-bold whitespace-nowrap sm:text-lg">
              {amount}
            </p>
          </div>
        </section>

        {/* Right column — express checkout + payment form */}
        <section aria-label="Payment details">
          {/* Link express checkout banner */}
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#22c55e] text-sm font-semibold text-[#04140a] transition hover:bg-[#1eb556]"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-black/25">
              <Link2 className="size-3" aria-hidden="true" />
            </span>

            <span className="rounded-[3px] bg-[#1434cb] px-1 py-px text-[8px] font-bold tracking-wide text-white italic">
              VISA
            </span>

            <span className="font-mono text-xs tracking-wider">•••• 4242</span>
          </button>

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />

            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              or
            </span>

            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handlePay} className="flex flex-col gap-5">
            {/* Contact information */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Contact information</p>

              <label htmlFor="payment-email" className="sr-only">
                Email
              </label>

              <Input
                id="payment-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="email@example.com"
                className={inputClass}
              />
            </div>

            {/* Payment method — card panel */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Payment method</p>

              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#141414]">
                {/* Card tab header */}
                <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium">
                  <CreditCard className="size-4 text-white/60" aria-hidden="true" />
                  Card
                </div>

                <div className="flex flex-col gap-4 border-t border-white/10 p-4">
                  {/* Card information */}
                  <div className="flex flex-col gap-2">
                    <p className={sectionLabelClass}>Card information</p>

                    <div className="relative">
                      <label htmlFor="payment-card" className="sr-only">
                        Card number
                      </label>

                      <Input
                        id="payment-card"
                        type="text"
                        name="cardNumber"
                        inputMode="numeric"
                        required
                        autoComplete="cc-number"
                        placeholder="1234 1234 1234 1234"
                        className={`${inputClass} pr-24`}
                      />

                      <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
                        <CardBrands />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="payment-expiry" className="sr-only">
                          Expiry
                        </label>

                        <Input
                          id="payment-expiry"
                          type="text"
                          name="expiry"
                          inputMode="numeric"
                          required
                          autoComplete="cc-exp"
                          placeholder="MM / YY"
                          className={inputClass}
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="payment-cvc" className="sr-only">
                          CVC
                        </label>

                        <Input
                          id="payment-cvc"
                          type="text"
                          name="cvc"
                          inputMode="numeric"
                          required
                          autoComplete="cc-csc"
                          placeholder="CVC"
                          className={`${inputClass} pr-9`}
                        />

                        <CircleHelp
                          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/35"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder name */}
                  <div className="flex flex-col gap-2">
                    <p className={sectionLabelClass}>Cardholder name</p>

                    <label htmlFor="payment-name" className="sr-only">
                      Full name on card
                    </label>

                    <Input
                      id="payment-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="cc-name"
                      placeholder="Full name on card"
                      className={inputClass}
                    />
                  </div>

                  {/* Country or region */}
                  <div className="flex flex-col gap-2">
                    <p className={sectionLabelClass}>Country or region</p>

                    <label htmlFor="payment-country" className="sr-only">
                      Country or region
                    </label>

                    <select
                      id="payment-country"
                      name="country"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                      autoComplete="country-name"
                      className={`${inputClass} appearance-none pr-9`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff99' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      {countries.map((name) => (
                        <option key={name} value={name} className="bg-[#141414]">
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save info for faster checkout */}
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#141414] p-4">
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(event) => setSaveInfo(event.target.checked)}
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#1476ff]"
              />

              <span>
                <span className="block text-xs font-medium text-white/85">
                  Save my information for faster checkout
                </span>

                <span className="mt-1 block text-[11px] text-white/40">
                  Pay securely on this site and save when Link is accepted.
                </span>
              </span>
            </label>

            {/* Pay */}
            <button
              type="submit"
              disabled={paying}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1476ff] text-sm font-semibold text-white transition-colors hover:bg-[#0d63e0] disabled:pointer-events-none disabled:opacity-60"
            >
              {paying ? "Redirecting…" : "Pay"}
            </button>
          </form>
        </section>
      </div>

      {/* Footer */}
      <footer className="pb-10 text-center">
        <p className="text-xs text-white/40">Powered by Stripe</p>

        <p className="mt-3 flex items-center justify-center gap-4 text-[11px] text-white/35">
          <Link href="/" className="transition-colors hover:text-white/70">
            Terms
          </Link>

          <Link href="/" className="transition-colors hover:text-white/70">
            Privacy
          </Link>
        </p>
      </footer>
    </main>
  )
}

/** Mini card-brand chips shown at the right edge of the card number field. */
function CardBrands() {
  return (
    <>
      <span className="rounded-[3px] bg-[#1434cb] px-1 py-px text-[8px] font-bold tracking-wide text-white italic">
        VISA
      </span>

      <span className="flex h-3.5 w-5 items-center justify-center rounded-[3px] bg-[#222]">
        <span className="relative flex items-center">
          <span className="size-2 rounded-full bg-[#eb001b]" />

          <span className="-ml-1 size-2 rounded-full bg-[#f79e1b]/90" />
        </span>
      </span>
    </>
  )
}
