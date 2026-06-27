import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="mx-auto mt-10 max-w-7xl rounded-t-xl bg-gray-950 px-6 py-8 text-white">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="mb-3 text-lg font-bold">FriendBazar</h3>
          <p className="text-sm text-gray-300">
            Your trusted online shopping partner with fast delivery all over Bangladesh.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Customer Service</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>Track Order</p>
            <p>Help Center</p>
            <p>Support Ticket</p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Policies</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>Privacy Policy</p>
            <p>Return & Refund</p>
            <p>Shipping Policy</p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Vendor Zone</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <Link href="/register">Become a Vendor</Link>
            <p>Sell on FriendBazar</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-800 pt-4 text-center text-xs text-gray-400">
        © 2026 FriendBazar. All Rights Reserved.
      </div>
    </footer>
  );
}