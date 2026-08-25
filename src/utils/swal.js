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

/**
 * Play authentic dual-harmonic bell chime sound using Web Audio API
 */
export const playNotificationBellSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Resume audio context if in suspended state
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Chime Tone 1: High crisp Bell Strike (880 Hz -> 1760 Hz harmonic)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Chime Tone 2: Warm Secondary Resonant Ring (1318.5 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, now + 0.08);
    gain2.gain.setValueAtTime(0.4, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.9);

    // Tone 3: Sparkling Bell overtone (2637 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(2637, now + 0.08);
    gain3.gain.setValueAtTime(0.2, now + 0.08);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.08);
    osc3.stop(now + 0.5);

    // Trigger mobile haptic vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([120, 60, 180]);
    }
  } catch (err) {
    console.error('Bell audio chime error', err);
  }
};

export default customSwal;
