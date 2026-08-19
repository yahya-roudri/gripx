import { useState } from "react";
import { trpc, getStoredAdminPassword, setStoredAdminPassword } from "@/providers/trpc";

export default function Admin() {
  const [passwordInput, setPasswordInput] = useState("");
  const [unlocked, setUnlocked] = useState(() => !!getStoredAdminPassword());

  const { data: orders, isLoading, error, refetch } = trpc.admin.orders.useQuery(
    undefined,
    { enabled: unlocked, retry: false }
  );

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-4">
        <form
          className="flex flex-col gap-4 w-full max-w-xs"
          onSubmit={(e) => {
            e.preventDefault();
            setStoredAdminPassword(passwordInput);
            setUnlocked(true);
          }}
        >
          <h1 className="text-lg font-semibold">Admin login</h1>
          <input
            type="password"
            autoFocus
            placeholder="Admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm outline-none focus:border-white"
          />
          <button
            type="submit"
            className="bg-white text-black rounded px-3 py-2 text-sm font-medium"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Orders</h1>
          <button
            className="text-xs text-neutral-400 underline"
            onClick={() => refetch()}
          >
            Refresh
          </button>
        </div>

        {isLoading && <p className="text-neutral-400 text-sm">Loading…</p>}

        {error && (
          <div className="text-red-400 text-sm">
            {error.data?.code === "UNAUTHORIZED"
              ? "Wrong password."
              : "Failed to load orders."}
            <button
              className="ml-2 underline"
              onClick={() => {
                setStoredAdminPassword("");
                setUnlocked(false);
              }}
            >
              Try again
            </button>
          </div>
        )}

        {orders && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-400 border-b border-neutral-800">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Qty</th>
                  <th className="py-2 pr-4">Total (MAD)</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">City</th>
                  <th className="py-2 pr-4">Address</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-900">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4">{o.productTitle}</td>
                    <td className="py-2 pr-4">{o.quantity}</td>
                    <td className="py-2 pr-4">{o.totalMAD}</td>
                    <td className="py-2 pr-4">{o.fullName}</td>
                    <td className="py-2 pr-4">{o.phone}</td>
                    <td className="py-2 pr-4">{o.city}</td>
                    <td className="py-2 pr-4 max-w-xs truncate">{o.address}</td>
                    <td className="py-2 pr-4">{o.status}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-neutral-500">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
