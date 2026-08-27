import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  FileText, 
  Copy, 
  Check, 
  ArrowUpRight, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  RefreshCw,
  ExternalLink,
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardLayout from './DashboardLayout';
import { downloadInvoicePdf } from '../../utils/invoiceGenerator';
import { showToast, customSwal } from '../../utils/swal';

export default function DashboardTransactions() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedTxnId, setCopiedTxnId] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getUserTransactions();
      if (res.success && res.transactions) {
        setTransactions(res.transactions);
      }
    } catch (e) {
      console.error('Error fetching transactions', e);
      showToast.error('Could not load transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedTxnId(id);
    showToast.success(`Copied: ${id}`);
    setTimeout(() => setCopiedTxnId(null), 2000);
  };

  const handleDownloadInvoice = (txn) => {
    try {
      const orderPayload = txn.orderData || {
        orderNumber: txn.orderNumber,
        totalAmount: txn.amount,
        productName: txn.productName,
        paymentId: txn.id,
        createdAt: txn.date,
        customerName: txn.customerName || currentUser?.name,
        customerPhone: txn.customerPhone || currentUser?.phone,
      };
      downloadInvoicePdf(orderPayload, currentUser);
      showToast.success('Tax Invoice downloaded!');
    } catch (err) {
      console.error(err);
      showToast.error('Could not generate invoice at this time.');
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (txn.id && txn.id.toLowerCase().includes(q)) ||
      (txn.orderNumber && txn.orderNumber.toLowerCase().includes(q)) ||
      (txn.productName && txn.productName.toLowerCase().includes(q)) ||
      (txn.paymentMethod && txn.paymentMethod.toLowerCase().includes(q));

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && txn.status === statusFilter;
  });

  const totalSpent = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const successCount = transactions.filter(t => t.status === 'SUCCESS' || t.status === 'PAID').length;

  return (
    <DashboardLayout currentTab="transactions" pageTitle="Payment Transactions">
      <div className="bg-white rounded-sm shadow-sm border border-gray-200/80 p-4 sm:p-6 space-y-6">
        
        {/* Header Title + Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#212121]">
                Payment Transactions & Invoices
              </h2>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {transactions.length} Total
              </span>
            </div>
            <p className="text-xs text-[#878787] mt-0.5">
              Secure ledger of all QR kit orders, booster quota renewals, and payment receipts
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search transaction ID, order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#2874f0]"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md text-xs font-bold">
              {['ALL', 'SUCCESS', 'PENDING'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    statusFilter === f ? 'bg-white text-[#2874f0] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#fbfbfb] p-3.5 rounded-xl border border-gray-200/70">
          <div className="p-2.5">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Total Amount Paid</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">₹{totalSpent.toLocaleString('en-IN')}</p>
          </div>

          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Successful Payments</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{successCount}</p>
          </div>

          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Payment Gateway</p>
            <p className="text-base font-black text-blue-600 mt-0.5">Razorpay Live</p>
            <span className="text-[10px] text-gray-500 font-medium">256-Bit SSL Encrypted</span>
          </div>

          <div className="p-2.5 border-l border-gray-200/70">
            <p className="text-[11px] text-[#878787] font-semibold uppercase tracking-wider">Official Invoices</p>
            <p className="text-xl font-black text-orange-600 mt-0.5">{transactions.length}</p>
            <span className="text-[10px] text-orange-600 font-medium">Instant PDF Download</span>
          </div>
        </div>

        {/* Transactions Table */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-gray-700">Loading Transaction Ledger...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
            <Receipt size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Transactions Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
              No payments matching your query were found.
            </p>
            <Link
              to="/shop"
              className="bg-[#2874f0] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm inline-block"
            >
              Order a Safety Kit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-700 font-bold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Transaction / Payment ID</th>
                  <th className="py-3 px-4">Order Ref & Product</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {filteredTransactions.map((t) => {
                  const isSuccess = t.status === 'SUCCESS' || t.status === 'PAID';
                  const formattedDate = t.date ? new Date(t.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : 'Recent';

                  return (
                    <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        <div className="flex items-center gap-1.5">
                          <span className="text-blue-600">{t.id}</span>
                          <button
                            onClick={() => handleCopy(t.id)}
                            className="text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                            title="Copy Transaction ID"
                          >
                            {copiedTxnId === t.id ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{t.productName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">Ref: {t.orderNumber}</div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-gray-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          <CreditCard size={11} className="text-gray-500" />
                          <span>{t.paymentMethod}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-gray-900 text-sm">
                        ₹{Number(t.amount || 299).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <CheckCircle2 size={11} />
                          <span>{t.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadInvoice(t)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-2.5 py-1.5 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Download Official Tax Invoice"
                          >
                            <FileText size={12} className="text-orange-500" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
