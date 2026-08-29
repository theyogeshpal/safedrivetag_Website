import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import PageLoader from '../../components/PageLoader';

export default function DashboardIndex() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    async function determineRoute() {
      if (!currentUser) {
        if (isMounted) navigate('/login', { replace: true });
        return;
      }
      
      try {
        const dashRes = await api.getDashboard();
        if (dashRes && dashRes.success) {
          const rawList = Array.isArray(dashRes.qrCodes) 
            ? dashRes.qrCodes 
            : (Array.isArray(dashRes.kits) ? dashRes.kits : []);
            
          const activeKits = rawList.filter(q => q.status === 'ACTIVE' || q.isRegistered || q.status === 'active');
          const count = Math.max(dashRes.stats?.activeQRs || 0, activeKits.length);
          
          if (count === 0) {
            if (isMounted) navigate('/dashboard/orders', { replace: true });
          } else {
            if (isMounted) navigate('/dashboard/tags', { replace: true });
          }
        } else {
          if (isMounted) navigate('/dashboard/orders', { replace: true });
        }
      } catch (err) {
        console.error('Error determining initial dashboard route:', err);
        if (isMounted) navigate('/dashboard/orders', { replace: true });
      }
    }
    
    determineRoute();
    
    return () => {
      isMounted = false;
    };
  }, [currentUser, navigate]);

  return <PageLoader text="Connecting to SafeDrive Security..." />;
}
