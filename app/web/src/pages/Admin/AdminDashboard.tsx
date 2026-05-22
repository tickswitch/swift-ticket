import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { GetData, GetSingleData } from '@/API/API';
import { formatShortDate } from '@/lib/formatDate';

interface AdminStats {
  pending: number;
  approved: number;
  rejected: number;
  total_listings: number;
}

interface AdminListingRow {
  id: number;
  title: string | null;
  venue: string | null;
  price: string;
  ticket_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: { id: number; name: string; email: string; phone: string | null };
}

const STATUS_TABS = ['pending', 'approved', 'rejected', 'all'] as const;
type StatusFilter = typeof STATUS_TABS[number];

const STATUS_COLORS = {
  pending:  'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  approved: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

const GLASS = 'bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.12)] backdrop-blur-md rounded-2xl';

const StatusChip = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[status as keyof typeof STATUS_COLORS] ?? 'bg-white/10 text-[#94A3B8]'}`}>
    {status}
  </span>
);

const StatCard = ({ label, count, accent }: { label: string; count: number; accent: string }) => (
  <div className={`${GLASS} p-5`}>
    <p className="text-xs font-proximaSemiBold text-[#CBD5E1] uppercase tracking-wider mb-2">{label}</p>
    <p className={`text-3xl font-proximaBold ${accent}`}>{count}</p>
  </div>
);

const AdminDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [page, setPage] = useState(1);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => GetData<AdminStats>('/admin/stats'),
    staleTime: 30_000,
  });

  const listingsEndpoint = `/admin/listings?${statusFilter !== 'all' ? `status=${statusFilter}&` : ''}page=${page}`;

  const { data: listingsResp, isLoading } = useQuery({
    queryKey: ['admin-listings', statusFilter, page],
    queryFn: () => GetSingleData<AdminListingRow[]>(listingsEndpoint),
    staleTime: 15_000,
  });

  const listings: AdminListingRow[] = listingsResp?.data ?? [];
  const pagination = (listingsResp as unknown as { pagination?: { total: number; page: number; total_pages: number } })?.pagination;

  const handleTabChange = (tab: StatusFilter) => {
    setStatusFilter(tab);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] px-6 py-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <h1 className="text-2xl font-semibold text-[#F8FAFC] mb-1">Admin Dashboard</h1>
        <p className="text-[#94A3B8] text-sm mb-8">Review and approve ticket listings</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Pending"  count={stats?.pending ?? 0}        accent="text-[#F59E0B]" />
          <StatCard label="Approved" count={stats?.approved ?? 0}       accent="text-[#10B981]" />
          <StatCard label="Rejected" count={stats?.rejected ?? 0}       accent="text-[#EF4444]" />
          <StatCard label="Total"    count={stats?.total_listings ?? 0} accent="text-[#2563EB]" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-proximaSemiBold capitalize transition-colors ${
                statusFilter === tab
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={`${GLASS} overflow-hidden`}>
          {isLoading ? (
            <div className="p-12 text-center text-[#94A3B8] font-proximaRegular">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center text-[#94A3B8] font-proximaRegular">No listings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.08)]">
                  <tr>
                    <th className="text-left px-5 py-3.5 text-[#64748B] font-proximaSemiBold text-xs uppercase tracking-wider w-16">ID</th>
                    <th className="text-left px-5 py-3.5 text-[#64748B] font-proximaSemiBold text-xs uppercase tracking-wider">Seller</th>
                    <th className="text-left px-5 py-3.5 text-[#64748B] font-proximaSemiBold text-xs uppercase tracking-wider">Event</th>
                    <th className="text-left px-5 py-3.5 text-[#64748B] font-proximaSemiBold text-xs uppercase tracking-wider">Price</th>
                    <th className="text-left px-5 py-3.5 text-[#64748B] font-proximaSemiBold text-xs uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3.5 text-[#64748B] font-proximaSemiBold text-xs uppercase tracking-wider">Submitted</th>
                    <th className="text-left px-5 py-3.5 text-[#64748B] font-proximaSemiBold text-xs uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                    >
                      <td className="px-5 py-3.5 text-[#64748B] text-sm font-mono text-nowrap">
                        #{listing.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#F8FAFC]">{listing.user.name}</p>
                        <p className="text-[#94A3B8] text-xs mt-0.5">{listing.user.email}</p>
                      </td>
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <p className="font-medium text-[#F8FAFC] truncate">{listing.title ?? '—'}</p>
                        <p className="text-[#94A3B8] text-xs mt-0.5 truncate">{listing.venue ?? '—'}</p>
                      </td>
                      <td className="px-5 py-3.5 text-nowrap">
                        <span className="text-[#F8FAFC] font-mono font-semibold">
                          ₹{Number(listing.price).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#94A3B8] capitalize text-nowrap">{listing.ticket_type}</td>
                      <td className="px-5 py-3.5 text-[#94A3B8] text-nowrap">
                        {formatShortDate(listing.created_at.split('T')[0])}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusChip status={listing.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/admin/listings/${listing.id}`}
                          className="text-[#2563EB] hover:text-[#93C5FD] font-proximaSemiBold text-sm text-nowrap transition-colors"
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-full border border-white/20 text-[#94A3B8] hover:text-white hover:bg-white/10 text-sm font-proximaSemiBold disabled:opacity-40 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-[#94A3B8] text-sm font-proximaRegular">
              Page <span className="text-[#2563EB] font-semibold">{page}</span> of {pagination.total_pages}
            </span>
            <button
              disabled={page === pagination.total_pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-full border border-white/20 text-[#94A3B8] hover:text-white hover:bg-white/10 text-sm font-proximaSemiBold disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
