import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoyaltyInfo: React.FC = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: 'Bronze',
      points: '0 – 499 points',
      ratio: '1× (Standard)',
      benefits: 'Basic access & general promotions',
      color: 'text-zinc-400'
    },
    {
      name: 'Silver',
      points: '500 – 1,999 points',
      ratio: '1.2× Boost',
      benefits: 'Special perks & monthly promotions',
      color: 'text-zinc-400'
    },
    {
      name: 'Gold',
      points: '2,000 – 4,999 points',
      ratio: '1.5× Boost',
      benefits: 'Priority service & exclusive discounts',
      color: 'text-white',
      isCurrent: true
    },
    {
      name: 'Platinum',
      points: '5,000+ points',
      ratio: '2× Boost',
      benefits: 'VIP perks, early access, & freebies',
      color: 'text-zinc-400'
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 flex items-center justify-between border-b border-zinc-100 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-widest text-black">Member Status</h1>
          <p className="mt-2 text-zinc-500">Your loyalty journey with Malstro</p>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black underline underline-offset-4"
        >
          <span className="material-icons text-sm">arrow_back</span>
          Back to Profile
        </button>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-zinc-900 p-8 text-white shadow-2xl">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 shadow-inner">
              <span className="material-icons text-white text-3xl">stars</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-widest">Gold Member</h2>
            <p className="mt-2 text-sm text-zinc-400">You are currently in the Gold tier. Keep shopping to reach Platinum!</p>
            
            <div className="mt-10 space-y-6">
              <div>
                <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Progress to Platinum</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800">
                  <div className="h-full w-[75%] rounded-full bg-yellow-500"></div>
                </div>
                <p className="mt-2 text-[10px] text-zinc-500 uppercase tracking-wider text-right">1,250 points until Platinum</p>
              </div>

              <div className="rounded-2xl bg-zinc-800/50 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Your Current Perks</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3 text-xs font-medium">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    1.5× Points on every purchase
                  </li>
                  <li className="flex items-center gap-3 text-xs font-medium">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    Exclusive birthday rewards
                  </li>
                  <li className="flex items-center gap-3 text-xs font-medium">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    Free shipping on all orders
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
            <h2 className="mb-8 text-xl font-black uppercase tracking-widest text-black">Loyalty Program Tiers</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <th className="pb-4">Level Tier</th>
                    <th className="pb-4">Points Required</th>
                    <th className="pb-4">Earning Ratio</th>
                    <th className="pb-4">Access & Exclusivity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {tiers.map((tier) => (
                    <tr key={tier.name} className={`group transition-colors ${tier.isCurrent ? 'bg-zinc-50' : ''}`}>
                      <td className="py-6 pr-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-black uppercase tracking-widest ${tier.isCurrent ? 'text-black' : 'text-zinc-400'}`}>
                            {tier.name}
                          </span>
                          {tier.isCurrent && (
                            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-yellow-700">
                              Current
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`py-6 pr-4 text-sm ${tier.isCurrent ? 'font-bold text-black' : 'text-zinc-500'}`}>
                        {tier.points}
                      </td>
                      <td className={`py-6 pr-4 text-sm ${tier.isCurrent ? 'font-bold text-black' : 'text-zinc-500'}`}>
                        {tier.ratio}
                      </td>
                      <td className={`py-6 text-sm ${tier.isCurrent ? 'font-bold text-black' : 'text-zinc-500'}`}>
                        {tier.benefits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 rounded-2xl bg-zinc-50 p-8">
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-black">How it works</h3>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-2">
                  <span className="text-2xl font-black text-zinc-200">01</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-black">Shop & Earn</p>
                  <p className="text-[11px] leading-relaxed text-zinc-500">Every IDR 1,000 spent earns you points based on your current tier ratio.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-2xl font-black text-zinc-200">02</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-black">Tier Up</p>
                  <p className="text-[11px] leading-relaxed text-zinc-500">Reach point milestones to automatically unlock the next tier and its benefits.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-2xl font-black text-zinc-200">03</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-black">Enjoy Perks</p>
                  <p className="text-[11px] leading-relaxed text-zinc-500">Redeem points for discounts or enjoy exclusive member-only services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyInfo;
