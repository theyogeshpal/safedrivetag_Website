import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export const customSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl p-6 font-sans shadow-2xl border border-gray-100',
    title: 'text-xl font-black text-gray-900',
    htmlContainer: 'text-sm text-gray-600 font-medium leading-relaxed',
    confirmButton: 'bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer mx-1.5',
    cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-5 py-3 rounded-xl transition-all cursor-pointer mx-1.5',
    denyButton: 'bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer mx-1.5',
  },
  buttonsStyling: false,
});

export const showNoActiveTagAlert = (navigate) => {
  return customSwal.fire({
    title: 'No Active SafeDrive-Tag Found!',
    html: `
      <div style="text-align: left; font-size: 13px; color: #4b5563; line-height: 1.6;">
        <p style="margin-bottom: 12px;">
          This section is currently <strong>disabled</strong> because no active QR safety tag is registered with your mobile number.
        </p>
        <div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 12px; color: #7c2d12; font-size: 12px;">
          🔒 <strong>Unlock Requirements:</strong><br />
          Activate your existing physical sticker kit or purchase a new safety tag to unlock full number masking, scan logs, and vehicle controls.
        </div>
      </div>
    `,
    icon: 'warning',
    iconColor: '#f97316',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: '🛒 Buy Tag (@ ₹299)',
    denyButtonText: '⚡ Link / Activate',
    cancelButtonText: 'Close',
  }).then((result) => {
    if (result.isConfirmed) {
      if (navigate) navigate('/shop');
      else window.location.href = '/shop';
    } else if (result.isDenied) {
      if (navigate) navigate('/register/SDT-FIRST');
      else window.location.href = '/register/SDT-FIRST';
    }
  });
};

export const showConfirmDialog = async ({ title, text, confirmText = 'Yes, Proceed', cancelText = 'Cancel', icon = 'question' }) => {
  const result = await customSwal.fire({
    title,
    text,
    icon,
    iconColor: icon === 'warning' ? '#f97316' : (icon === 'question' ? '#2874f0' : '#10b981'),
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
  return result.isConfirmed;
};

export const showToast = {
  success: (msg) => toast.success(msg, {
    style: {
      borderRadius: '12px',
      background: '#ffffff',
      color: '#111827',
      fontWeight: 'bold',
      fontSize: '13px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
  }),
  error: (msg) => toast.error(msg, {
    style: {
      borderRadius: '12px',
      background: '#ffffff',
      color: '#111827',
      fontWeight: 'bold',
      fontSize: '13px',
      border: '1px solid #fee2e2',
      boxShadow: '0 10px 30px rgba(239,68,68,0.1)',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
  }),
  info: (msg) => toast(msg, {
    style: {
      borderRadius: '12px',
      background: '#ffffff',
      color: '#111827',
      fontWeight: 'bold',
      fontSize: '13px',
      border: '1px solid #e0e7ff',
      boxShadow: '0 10px 30px rgba(79,70,229,0.1)',
    },
  }),
};

export default customSwal;
