export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-4">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex min-h-[220px] items-center rounded-xl bg-gradient-to-r from-orange-500 to-black p-6 text-white md:min-h-[360px]">
          <div>
            <p className="mb-2 text-sm font-medium">Big Sale</p>
            <h1 className="max-w-xl text-3xl font-bold md:text-5xl">
              Shop Smart with FriendBazar
            </h1>
            <p className="mt-3 max-w-md text-sm text-orange-100 md:text-base">
              Quality products, trusted vendors and cash on delivery across Bangladesh.
            </p>
            <button className="mt-5 rounded-md bg-white px-5 py-2 font-semibold text-orange-600">
              Shop Now
            </button>
          </div>
        </div>

        <div className="hidden gap-4 lg:grid">
          <div className="rounded-xl bg-orange-100 p-5">
            <h3 className="text-xl font-bold">Flash Deals</h3>
            <p className="text-sm text-gray-600">Limited time offers</p>
          </div>
          <div className="rounded-xl bg-gray-900 p-5 text-white">
            <h3 className="text-xl font-bold">New Arrivals</h3>
            <p className="text-sm text-gray-300">Fresh products every day</p>
          </div>
        </div>
      </div>
    </section>
  );
}