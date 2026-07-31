import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { User, Order } from '../types';

interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUsername: (newUsername: string) => void;
  orders: Order[];
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUsername, orders }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    setEditUsername(user.username);
  }, [user.username]);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      fullName: `${user.firstName} ${user.lastName}`.trim() || user.username,
      street: 'Jl. Kemang Raya No. 10',
      city: 'Jakarta Selatan',
      postalCode: '12730',
      isDefault: true
    }
  ]);

  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    label: '',
    fullName: '',
    street: '',
    city: '',
    postalCode: ''
  });

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleSaveProfile = () => {
    if (editUsername.trim()) {
      onUpdateUsername(editUsername);
      setIsEditing(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = {
      ...newAddress,
      id: Date.now().toString(),
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, address]);
    setShowAddressForm(false);
    setNewAddress({ label: '', fullName: '', street: '', city: '', postalCode: '' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'addresses':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-widest text-black">My Addresses</h2>
              {!showAddressForm && (
                <button 
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black underline underline-offset-4"
                >
                  <span className="material-icons text-sm">add</span>
                  Add New Address
                </button>
              )}
            </div>

            {showAddressForm ? (
              <form onSubmit={handleAddAddress} className="rounded-2xl border border-black p-8 space-y-6 bg-zinc-50">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Address Label (e.g. Home, Office)</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border-b border-zinc-300 bg-transparent py-2 text-sm outline-none focus:border-black"
                      value={newAddress.label}
                      onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                      placeholder="Home"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border-b border-zinc-300 bg-transparent py-2 text-sm outline-none focus:border-black"
                      value={newAddress.fullName}
                      onChange={e => setNewAddress({...newAddress, fullName: e.target.value})}
                      placeholder="Your Name"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Street Address</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border-b border-zinc-300 bg-transparent py-2 text-sm outline-none focus:border-black"
                    value={newAddress.street}
                    onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                    placeholder="Street name, building, apartment"
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">City</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border-b border-zinc-300 bg-transparent py-2 text-sm outline-none focus:border-black"
                      value={newAddress.city}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Postal Code</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border-b border-zinc-300 bg-transparent py-2 text-sm outline-none focus:border-black"
                      value={newAddress.postalCode}
                      onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})}
                      placeholder="12345"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800 hover:shadow-lg active:scale-95"
                  >
                    Save Address
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="rounded-full border border-black bg-white px-8 py-3 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-zinc-50 active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {addresses.map(addr => (
                  <div key={addr.id} className="relative rounded-2xl border border-zinc-100 p-6 shadow-sm transition hover:border-black">
                    {addr.isDefault && (
                      <span className="absolute right-6 top-6 rounded-full bg-zinc-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                        Default
                      </span>
                    )}
                    <h3 className="text-sm font-black uppercase tracking-widest text-black">{addr.label}</h3>
                    <div className="mt-4 space-y-1 text-sm text-zinc-600">
                      <p className="font-bold text-black">{addr.fullName}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.postalCode}</p>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button className="text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-2">Edit</button>
                      <button className="text-[10px] font-black uppercase tracking-widest text-red-600 underline underline-offset-2">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-widest text-black">Order History</h2>
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center bg-white">
                <span className="material-icons text-4xl text-zinc-300">shopping_cart</span>
                <p className="mt-4 text-sm font-medium text-zinc-500">You haven't placed any orders yet.</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-6 text-xs font-black uppercase tracking-widest text-black underline underline-offset-4"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-zinc-200 bg-white overflow-hidden hover:border-black transition-colors">
                    <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Order ID</p>
                          <p className="text-xs font-black uppercase">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Date</p>
                          <p className="text-xs font-black uppercase">{new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total</p>
                          <p className="text-xs font-black uppercase">IDR {order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600">{order.status}</span>
                      </div>
                    </div>
                    <div className="p-6">
                       <div className="flex -space-x-4 overflow-hidden mb-4">
                          {order.items.slice(0, 5).map((item, idx) => (
                             <img 
                                key={idx} 
                                src={item.image} 
                                alt={item.title} 
                                className="h-12 w-12 rounded-full border-2 border-white object-contain bg-white shadow-sm" 
                             />
                          ))}
                          {order.items.length > 5 && (
                             <div className="h-12 w-12 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-black">
                                +{order.items.length - 5}
                             </div>
                          )}
                       </div>
                       <div className="flex items-center justify-between">
                          <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                             {order.items.length} item{order.items.length > 1 ? 's' : ''} via {order.paymentMethod}
                          </p>
                          <button className="text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-4">
                             View Details
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'wishlist':
        return (
          <div>
            <h2 className="mb-6 text-xl font-black uppercase tracking-widest text-black">My Wishlist</h2>
            <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center">
              <span className="material-icons text-4xl text-zinc-300">favorite_border</span>
              <p className="mt-4 text-sm font-medium text-zinc-500">Your wishlist is empty.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-6 text-xs font-black uppercase tracking-widest text-black underline underline-offset-4"
              >
                Go to Shop
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="rounded-2xl border border-zinc-100 p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-widest text-black">Personal Information</h2>
              {isEditing ? (
                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveProfile}
                    className="rounded-full bg-black px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-95"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditUsername(username);
                    }}
                    className="rounded-full border border-black bg-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-zinc-50 active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-black uppercase tracking-widest text-black underline underline-offset-4"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">First Name</label>
                  <p className="mt-1 text-lg font-bold text-black">{user.firstName || '-'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Name</label>
                  <p className="mt-1 text-lg font-bold text-black">{user.lastName || '-'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="mt-1 w-full border-b border-black bg-transparent py-2 text-lg font-bold text-black outline-none"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p className="mt-1 text-lg font-bold text-black">{user.username}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                  <p className="mt-1 text-lg font-bold text-black">{user.email}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                  <p className="mt-1 text-lg font-bold text-black">{user.phone || '-'}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Loyalty Status</label>
                  <button 
                    onClick={() => navigate('/loyalty')}
                    className="text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-4"
                  >
                    View Details
                  </button>
                </div>
                <div 
                  onClick={() => navigate('/loyalty')}
                  className="flex cursor-pointer items-center gap-3 rounded-xl bg-zinc-900 p-4 text-white transition hover:bg-black"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                    <span className="material-icons text-white">stars</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">Gold Member</p>
                    <p className="text-[10px] text-zinc-400">1,250 points until Platinum</p>
                  </div>
                  <span className="material-icons ml-auto text-zinc-600">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 border-b border-zinc-100 pb-8">
        <h1 className="text-4xl font-black uppercase tracking-widest text-black">My Account</h1>
        <p className="mt-2 text-zinc-500">Manage your profile and orders</p>
      </div>

      <div className="grid gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="sticky top-32 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <span className="material-icons text-xl">person</span>
              Profile Details
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <span className="material-icons text-xl">shopping_basket</span>
              Order History
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${activeTab === 'wishlist' ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <span className="material-icons text-xl">favorite</span>
              Wishlist
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${activeTab === 'addresses' ? 'bg-black text-white focus:ring-2 focus:ring-yellow-500' : 'text-zinc-600 hover:bg-zinc-50'}`}
              data-test="addresses-tab"
            >
              <span className="material-icons text-xl">location_on</span>
              Addresses
            </button>
            <button 
              onClick={() => navigate('/loyalty')}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-zinc-600 hover:bg-zinc-50"
            >
              <span className="material-icons text-xl">workspace_premium</span>
              Loyalty Program
            </button>
            <div className="pt-8">
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                <span className="material-icons text-xl">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
