import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white">
      <nav className="w-full flex justify-between items-center px-8 py-5 text-sm border-b border-gray-800/50">
        <div className="font-bold tracking-wide text-xl text-purple-400">Subra</div>
        <div className="flex items-center gap-8">
          <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
          <a href="#how" className="text-gray-400 hover:text-white transition">How It Works</a>
          <a href="#reviews" className="text-gray-400 hover:text-white transition">Reviews</a>
          <a href="#" className="text-gray-400 hover:text-white transition">Log in</a>
          <Link href="/analyze">
            <button className="bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-500 transition">Get Started</button>
          </Link>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center px-6 pt-28 pb-20">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
          <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>
          <span className="text-purple-300 text-sm">Smarter spending starts here</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tight leading-tight max-w-3xl">
          Stop paying for the same shows <span className="text-purple-400">twice.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 text-center max-w-2xl leading-relaxed">
          Subra finds duplicate subscriptions, hidden overlaps, and unused services so you can cancel with confidence and keep more of what you earn.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/analyze">
            <button className="bg-purple-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-purple-500 transition shadow-lg shadow-purple-600/25">Get Started Free</button>
          </Link>
          <a href="#how">
            <button className="border border-gray-700 text-gray-300 px-8 py-3.5 rounded-full font-medium hover:border-gray-500 hover:text-white transition">See How It Works</button>
          </a>
        </div>
      </div>
      <div id="how" className="px-8 py-24 max-w-4xl mx-auto">
        <p className="text-center text-sm uppercase tracking-widest text-purple-400 mb-3">How It Works</p>
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">Three steps to start saving</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">1</div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <p className="text-gray-400 text-sm">Tell us what you subscribe to. It only takes a minute.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">2</div>
            <h3 className="font-semibold mb-2">Scan</h3>
            <p className="text-gray-400 text-sm">We analyze your subscriptions and find overlaps and waste.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">3</div>
            <h3 className="font-semibold mb-2">Save</h3>
            <p className="text-gray-400 text-sm">Get clear recommendations and cancel what you do not need.</p>
          </div>
        </div>
      </div>
      <div id="features" className="px-8 pb-24 max-w-6xl mx-auto">
        <p className="text-center text-sm uppercase tracking-widest text-purple-400 mb-3">Built to Save You More</p>
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">Everything you need. Nothing you do not.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-purple-500/50 transition">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5"><span className="text-purple-400 text-xl">🔍</span></div>
            <h3 className="text-lg font-semibold mb-3">Find Duplicates</h3>
            <p className="text-gray-400 text-sm leading-relaxed">We scan your subscriptions to spot overlaps instantly.</p>
          </div>
          <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-purple-500/50 transition">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-5"><span className="text-green-400 text-xl">💰</span></div>
            <h3 className="text-lg font-semibold mb-3">Save Money</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Get clear recommendations on what to cancel.</p>
          </div>
          <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-purple-500/50 transition">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5"><span className="text-blue-400 text-xl">🎯</span></div>
            <h3 className="text-lg font-semibold mb-3">Stay in Control</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Track renewals and get alerts before you are billed.</p>
          </div>
        </div>
      </div>
      <div id="reviews" className="px-8 py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-purple-400 mb-3">Loved by Savvy Spenders</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Real people. Real savings.</h2>
          <p className="text-gray-400 mb-12 max-w-lg">Subra has already helped thousands cut waste and save smarter.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-6">I had no idea Hulu and Peacock had that much overlap. Subra caught it in seconds and I dropped one the same day. Saving $13 a month sounds small until you realize that is $156 a year on stuff I was already getting.</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">J</div>
                <div><p className="text-sm font-medium">Jessica M.</p><p className="text-xs text-gray-500">New York, NY</p></div>
              </div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-6">My wife and I were paying for six streaming services. We knew it was too many but never sat down to figure out which ones to drop. Ran it through Subra and cut three in about ten minutes.</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">D</div>
                <div><p className="text-sm font-medium">David L.</p><p className="text-xs text-gray-500">Austin, TX</p></div>
              </div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-6">The rental warning was the part that got me. I did not even realize how much I was spending on random movie rentals through Apple TV on top of the subscription itself. Subra broke it all down clearly.</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">A</div>
                <div><p className="text-sm font-medium">Aisha K.</p><p className="text-xs text-gray-500">Toronto, ON</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to stop overpaying?</h2>
          <p className="text-purple-200 mb-8">Join thousands who are saving money every month with Subra.</p>
          <Link href="/analyze"><button className="bg-white text-purple-700 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition">Get Started Free</button></Link>
        </div>
      </div>
      <footer className="border-t border-gray-800/50 px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm">2026 Subra. All rights reserved.</div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}