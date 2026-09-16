'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SubscriptionProcessPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const action = searchParams.get('action');

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Processing your request...');
  
  // Kutumia useRef kuzuia useEffect isijirudie mara mbili kwenye React Strict Mode
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!id || !action) {
      setStatus('error');
      setMessage('Invalid or missing parameters.');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    // Sasa tunatumia POST request na data ziko kwenye body
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription-plans/process-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      
      },
      body: JSON.stringify({ id, action })
    })
    .then(async (res) => {
      const data = await res.text();
      if (res.ok) {
        setStatus('success');
        setMessage(action === 'APPROVE' ? 'Subscription approved successfully!' : 'Subscription rejected successfully.');
      } else {
        setStatus('error');
        setMessage(data || 'Failed to process the request.');
      }
    })
    .catch((err) => {
      setStatus('error');
      setMessage('Network error: Unable to connect to the server.');
    });
  }, [id, action]);

  return (
    <div style={{ background: '#f4f6f9', fontFamily: 'Arial, sans-serif', textAlign: 'center', paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '500px', margin: 'auto', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
        
        {status === 'loading' && (
          <div>
            <h2 style={{ color: '#2563eb' }}>Processing...</h2>
            <p style={{ color: '#4b5563' }}>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h2 style={{ color: action === 'APPROVE' ? '#166534' : '#dc2626' }}>
              {action === 'APPROVE' ? '✓ Subscription Approved!' : '✕ Subscription Rejected'}
            </h2>
            <p style={{ color: '#4b5563', fontSize: '15px' }}>{message}</p>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '30px' }}>You can safely close this browser window.</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h2 style={{ color: '#d97706' }}>⚠️ Action Failed</h2>
            <p style={{ color: '#4b5563', fontSize: '15px' }}>{message}</p>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '30px' }}>This link may have already been used or expired.</p>
          </div>
        )}

      </div>
    </div>
  );
}