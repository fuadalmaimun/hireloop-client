import { checkoutVerify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"
import { Copy } from "lucide-react"
import { redirect } from "next/navigation"
import CopyButton from "./copy-button"

interface SuccessSearchParams {
  session_id?: string
}

interface SuccessProps {
  searchParams: Promise<SuccessSearchParams>
}

export default async function Success({ searchParams }: SuccessProps) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error("Please provide a valid session_id (cs_test_...)")

  const {
    status,
    payment_status,
    customer_email,
    amount_total,
    currency,
    subscription,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent", "subscription"],
  })

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete" && payment_status === "paid") {
    const subscriptionId =
      typeof subscription === "string" ? subscription : subscription?.id

    const result = await checkoutVerify(session_id)
    console.log({ result })

    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl sm:p-8">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <svg
                className="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              Payment Successful!
            </h1>
            <p className="text-sm text-gray-400">
              Thank you for your payment. Your transaction has been completed
              successfully.
            </p>
          </div>

          {/* Amount */}
          <div className="mb-6 rounded-xl bg-gray-800 p-5 text-center">
            <p className="mb-1 text-sm text-gray-400">Total Paid</p>
            <p className="text-3xl font-bold text-green-400">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency?.toUpperCase() || "USD",
              }).format((amount_total || 0) / 100)}
            </p>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <div className="flex justify-between gap-4 border-b border-gray-800 pb-3">
              <span className="text-sm text-gray-400">Payment Status</span>
              <span className="text-sm font-medium text-green-400 capitalize">
                {payment_status}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-800 pb-3">
              <span className="text-sm text-gray-400">Customer Email</span>
              <span className="text-right text-sm font-medium break-all">
                {customer_email || "Not available"}
              </span>
            </div>

            <div className="border-b border-gray-800 pb-3">
              <p className="mb-2 text-sm text-gray-400">Subscription ID</p>

              <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-3">
                <p className="flex-1 font-mono text-xs break-all text-green-400">
                  {subscriptionId || "Not available"}
                </p>

                {subscriptionId && <CopyButton text={subscriptionId} />}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Session ID</p>
              <p className="rounded-lg bg-gray-800 p-3 font-mono text-xs break-all text-gray-300">
                {session_id}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-800 pt-6 text-center">
            <p className="text-sm text-gray-400">
              A confirmation email will be sent to your email address.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return redirect("/")
}
