import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetSingleData, PostData } from '@/API/API';
import { formatShortDate } from '@/lib/formatDate';
import toast from 'react-hot-toast';
import { ArrowLeft, ShieldCheck, Clock, XCircle } from 'lucide-react';

interface AdminListingDetail {
  id: number;
  title: string | null;
  venue: string | null;
  artist: string | null;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  time: string | null;
  ticket_type: string;
  seat_info: string | null;
  additional_info: string | null;
  price: string;
  original_price: string;
  buyer_fee: string | null;
  seller_fee: string | null;
  seller_receives: string | null;
  total_buyer_pays: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  ticket_file: string | null;
  ticket_file_url: string | null;
  created_at: string;
  user: { id: number; name: string; email: string; phone: string | null };
}

const STATUS_CONFIG = {
  pending:  { icon: Clock,       label: 'Pending Review', cls: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  approved: { icon: ShieldCheck, label: 'Approved',       cls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  rejected: { icon: XCircle,     label: 'Rejected',       cls: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

const GLASS = 'bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.12)] backdrop-blur-md rounded-2xl';
const DIVIDER = 'border-t border-[rgba(255,255,255,0.08)]';

const fmt = (val: string | null | undefined) =>
  val ? `₹${Number(val).toLocaleString('en-IN')}` : '—';

const AdminListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ['admin-listing', id],
    queryFn: () => GetSingleData<AdminListingDetail>(`/admin/listings/${id}`),
    enabled: !!id,
  });

  const ticket: AdminListingDetail | undefined = resp?.data;

  const onMutateSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    navigate('/admin');
  };

  const approveMutation = useMutation({
    mutationFn: () => PostData(`/admin/listings/${id}/approve`, {}, 'patch'),
    onSuccess: () => onMutateSuccess('Listing approved'),
    onError: () => toast.error('Failed to approve listing'),
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => PostData(`/admin/listings/${id}/reject`, { reason }, 'patch'),
    onSuccess: () => onMutateSuccess('Listing rejected'),
    onError: () => toast.error('Failed to reject listing'),
  });

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }
    rejectMutation.mutate(rejectReason.trim());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] px-6 py-8">
        <div className={`${GLASS} p-12 text-center text-[#94A3B8] max-w-7xl mx-auto`}>
          Loading listing...
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="min-h-screen bg-[#0F172A] px-6 py-8">
        <div className={`${GLASS} p-12 text-center text-red-400 max-w-7xl mx-auto`}>
          Listing not found.
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[ticket.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="min-h-screen bg-[#0F172A] px-6 py-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 border border-white/20 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-xl font-semibold text-[#F8FAFC] mb-6">
          Review Listing #{ticket.id}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: PDF Viewer (60%) */}
          <div className="lg:w-[60%]">
            <div className={`${GLASS} overflow-hidden h-full`}>
              <div className={`px-5 py-4 ${DIVIDER}`}>
                <p className="text-[#94A3B8] text-xs uppercase tracking-wider font-proximaSemiBold">
                  Ticket File
                </p>
              </div>
              {ticket.ticket_file_url ? (
                <iframe
                  src={ticket.ticket_file_url}
                  width="100%"
                  height="600px"
                  className="block"
                  title="Ticket file preview"
                />
              ) : (
                <div className="flex items-center justify-center h-[600px] text-[#64748B] font-proximaRegular text-sm">
                  No ticket file uploaded
                </div>
              )}
            </div>
          </div>

          {/* Right: Details (40%) */}
          <div className="lg:w-[40%] flex flex-col gap-4">
            {/* Status */}
            <div className={`${GLASS} p-5`}>
              <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-3">Status</p>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-proximaSemiBold ${statusCfg.cls}`}>
                <StatusIcon className="w-4 h-4" />
                {statusCfg.label}
              </span>
              {ticket.admin_notes && (
                <div className={`mt-3 pt-3 ${DIVIDER}`}>
                  <p className="text-sm text-[#94A3B8]">
                    <span className="font-medium text-[#F8FAFC]">Note: </span>
                    {ticket.admin_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Seller */}
            <div className={`${GLASS} p-5`}>
              <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-3">Seller</p>
              <p className="font-medium text-[#F8FAFC]">{ticket.user.name}</p>
              <p className="text-[#94A3B8] text-sm mt-0.5">{ticket.user.email}</p>
              {ticket.user.phone && (
                <p className="text-[#94A3B8] text-sm mt-0.5">{ticket.user.phone}</p>
              )}
            </div>

            {/* Event */}
            <div className={`${GLASS} p-5`}>
              <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-3">Event</p>
              <div className="space-y-2">
                <Row label="Title"     value={ticket.title} />
                <Row label="Venue"     value={ticket.venue} />
                <Row label="Artist"    value={ticket.artist} />
                <Row label="Category"  value={ticket.category} />
                <Row
                  label="Date"
                  value={ticket.start_date ? formatShortDate(ticket.start_date.split('T')[0]) : undefined}
                />
                <Row label="Time"      value={ticket.time} />
                <Row label="Type"      value={ticket.ticket_type} />
                <Row label="Seat Info" value={ticket.seat_info} />
                {ticket.additional_info && (
                  <div className={`pt-2 mt-1 ${DIVIDER}`}>
                    <p className="text-[#64748B] text-xs mb-1">Notes</p>
                    <p className="text-[#F8FAFC] text-sm">{ticket.additional_info}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className={`${GLASS} p-5`}>
              <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-3">Pricing</p>
              <div className="space-y-2">
                <Row label="Original Face Value" value={fmt(ticket.original_price)} mono />
                <Row label="Listing Price"        value={fmt(ticket.price)}          mono highlight />
                <Row label="Buyer Fee (5%)"       value={fmt(ticket.buyer_fee)}      mono />
                <Row label="Seller Fee (5%)"      value={fmt(ticket.seller_fee)}     mono />
                <div className={`pt-2 mt-1 space-y-2 ${DIVIDER}`}>
                  <Row label="Total Buyer Pays"  value={fmt(ticket.total_buyer_pays)}  mono bold />
                  <Row label="Seller Receives"   value={fmt(ticket.seller_receives)}   mono bold />
                </div>
              </div>
            </div>

            {/* Actions — only shown when pending */}
            {ticket.status === 'pending' && (
              <div className={`${GLASS} p-5`}>
                <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-4">Actions</p>

                {!showRejectForm ? (
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => approveMutation.mutate()}
                      disabled={approveMutation.isPending}
                      className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white rounded-full py-3 text-sm font-medium transition-colors"
                    >
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-full py-3 text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 text-[#F8FAFC] placeholder:text-[#64748B] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleReject}
                        disabled={rejectMutation.isPending}
                        className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-60 rounded-full py-3 text-sm font-medium transition-colors"
                      >
                        {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
                      </button>
                      <button
                        onClick={() => { setShowRejectForm(false); setRejectReason(''); }}
                        className="px-5 py-3 text-[#94A3B8] hover:text-[#F8FAFC] text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({
  label,
  value,
  bold,
  mono,
  highlight,
}: {
  label: string;
  value?: string | null;
  bold?: boolean;
  mono?: boolean;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-start gap-3">
    <p className="text-[#64748B] text-sm shrink-0">{label}</p>
    <p
      className={[
        'text-right',
        highlight ? 'text-[#F8FAFC] font-semibold text-lg' : bold ? 'text-[#F8FAFC] font-semibold text-sm' : 'text-[#F8FAFC] text-sm',
        mono ? 'font-mono' : '',
      ].join(' ')}
    >
      {value ?? '—'}
    </p>
  </div>
);

export default AdminListingDetail;
