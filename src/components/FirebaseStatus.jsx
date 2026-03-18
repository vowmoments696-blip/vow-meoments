// Firebase connection status component (for testing)
import { useState, useEffect } from 'react';
import { checkFirebaseConnection } from '../utils/firebase.js';

export default function FirebaseStatus() {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [details, setDetails] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check if Firebase globals are available
        if (!window.firebaseApp) {
          setStatus('failed');
          setError('Firebase app not initialized');
          setDetails('Check console for Firebase initialization errors');
          return;
        }

        if (!window.firebaseDb) {
          setStatus('failed');
          setError('Firestore not initialized');
          setDetails('Database connection failed');
          return;
        }

        if (!window.firestoreModule) {
          setStatus('failed');
          setError('Firestore module not loaded');
          setDetails('Firestore functions not available');
          return;
        }

        // Test actual connection
        const isConnected = await checkFirebaseConnection();
        if (isConnected) {
          setStatus('connected');
          setDetails('All systems operational');
        } else {
          setStatus('failed');
          setError('Connection test failed');
          setDetails('Unable to read from Firestore');
        }
      } catch (err) {
        setStatus('failed');
        setError(err.message);
        setDetails('Check network connection and Firebase rules');
      }
    };

    // Wait for Firebase to initialize
    if (window.firebaseInitialized) {
      testConnection();
    } else {
      window.addEventListener('firebaseReady', testConnection, { once: true });
      
      // Fallback timeout
      setTimeout(() => {
        if (status === 'checking') {
          setStatus('failed');
          setError('Initialization timeout');
          setDetails('Firebase took too long to initialize');
        }
      }, 15000);
    }
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case 'checking': return '#ffc107';
      case 'connected': return '#28a745';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking': return '🔄';
      case 'connected': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking': return 'Connecting to Firebase...';
      case 'connected': return 'Firebase Connected';
      case 'failed': return `Firebase Error: ${error}`;
      default: return 'Unknown status';
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: getStatusColor(), 
        color: '#fff', 
        padding: '8px 12px', 
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '250px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
      onClick={async () => {
        if (status === 'failed') {
          console.log('Firebase Debug Info:', {
            firebaseApp: !!window.firebaseApp,
            firebaseDb: !!window.firebaseDb,
            firestoreModule: !!window.firestoreModule,
            firebaseInitialized: !!window.firebaseInitialized,
            error: error,
            details: details
          });
        } else if (status === 'connected') {
          // Test booking save
          try {
            const { saveBookingToFirestore } = await import('../utils/firebase.js');
            const testBooking = {
              clientName: 'Test User',
              email: 'test@example.com',
              phone: '+91 9876543210',
              eventType: 'Wedding',
              eventDate: '2024-12-25',
              message: 'Test booking from Firebase status'
            };
            const result = await saveBookingToFirestore(testBooking);
            console.log('Test booking saved:', result);
            alert('Test booking saved successfully! Check console for details.');
          } catch (err) {
            console.error('Test booking failed:', err);
            alert('Test booking failed: ' + err.message);
          }
        }
      }}
      title={details}
    >
      {getStatusIcon()} {getStatusText()}
      {status === 'failed' && (
        <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.9 }}>
          Click for debug info
        </div>
      )}
      {status === 'connected' && (
        <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.9 }}>
          Click to test booking
        </div>
      )}
    </div>
  );
}