// Firebase utility functions for Firestore operations
// Wait for Firebase to be initialized
const waitForFirebase = () => {
  return new Promise((resolve, reject) => {
    if (window.firebaseInitialized && window.firestoreModule) {
      resolve();
      return;
    }
    
    const timeout = setTimeout(() => {
      reject(new Error('Firebase initialization timeout'));
    }, 10000);
    
    window.addEventListener('firebaseReady', () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
  });
};

// Get Firestore instance and functions
const getFirestoreUtils = async () => {
  await waitForFirebase();
  
  if (!window.firebaseDb || !window.firestoreModule) {
    throw new Error('Firebase not properly initialized');
  }
  
  return {
    db: window.firebaseDb,
    collection: window.firestoreModule.collection,
    addDoc: window.firestoreModule.addDoc,
    getDocs: window.firestoreModule.getDocs,
    doc: window.firestoreModule.doc,
    updateDoc: window.firestoreModule.updateDoc,
    deleteDoc: window.firestoreModule.deleteDoc,
    query: window.firestoreModule.query,
    orderBy: window.firestoreModule.orderBy,
    serverTimestamp: window.firestoreModule.serverTimestamp
  };
};

// ── REELS OPERATIONS ──

export const saveReelToFirestore = async (reelData) => {
  try {
    const { db, collection, addDoc, serverTimestamp } = await getFirestoreUtils();
    const reelsCollection = collection(db, 'reels');
    
    const reelWithTimestamp = {
      ...reelData,
      uploadDate: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('Saving reel to Firestore:', reelWithTimestamp);
    const docRef = await addDoc(reelsCollection, reelWithTimestamp);
    console.log('Reel saved with ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...reelWithTimestamp
    };
  } catch (error) {
    console.error('Error saving reel to Firestore:', error);
    throw error;
  }
};

export const getReelsFromFirestore = async () => {
  try {
    const { db, collection, getDocs, query, orderBy } = await getFirestoreUtils();
    const reelsCollection = collection(db, 'reels');
    const q = query(reelsCollection, orderBy('createdAt', 'desc'));
    
    console.log('Fetching reels from Firestore...');
    const querySnapshot = await getDocs(q);
    const reels = [];
    
    querySnapshot.forEach((doc) => {
      reels.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Fetched reels:', reels);
    return reels;
  } catch (error) {
    console.error('Error getting reels from Firestore:', error);
    return [];
  }
};

export const deleteReelFromFirestore = async (reelId) => {
  try {
    const { db, doc, deleteDoc } = await getFirestoreUtils();
    const reelDoc = doc(db, 'reels', reelId);
    
    console.log('Deleting reel from Firestore:', reelId);
    await deleteDoc(reelDoc);
    console.log('Reel deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting reel from Firestore:', error);
    return false;
  }
};

// ── BOOKINGS OPERATIONS ──

export const saveBookingToFirestore = async (bookingData) => {
  try {
    const { db, collection, addDoc, serverTimestamp } = await getFirestoreUtils();
    const bookingsCollection = collection(db, 'bookings');
    
    const bookingWithTimestamp = {
      ...bookingData,
      status: 'pending',
      bookingDate: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('Saving booking to Firestore:', bookingWithTimestamp);
    const docRef = await addDoc(bookingsCollection, bookingWithTimestamp);
    console.log('Booking saved with ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...bookingWithTimestamp
    };
  } catch (error) {
    console.error('Error saving booking to Firestore:', error);
    throw error;
  }
};

export const getBookingsFromFirestore = async () => {
  try {
    const { db, collection, getDocs, query, orderBy } = await getFirestoreUtils();
    const bookingsCollection = collection(db, 'bookings');
    const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
    
    console.log('Fetching bookings from Firestore...');
    const querySnapshot = await getDocs(q);
    const bookings = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to readable dates
        bookingDate: data.createdAt && data.createdAt.seconds ? 
          new Date(data.createdAt.seconds * 1000).toISOString().split('T')[0] : 
          data.bookingDate
      });
    });
    
    console.log('Fetched bookings:', bookings);
    return bookings;
  } catch (error) {
    console.error('Error getting bookings from Firestore:', error);
    return [];
  }
};

export const updateBookingStatusInFirestore = async (bookingId, newStatus) => {
  try {
    const { db, doc, updateDoc, serverTimestamp } = await getFirestoreUtils();
    const bookingDoc = doc(db, 'bookings', bookingId);
    
    console.log('Updating booking status:', bookingId, newStatus);
    await updateDoc(bookingDoc, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    console.log('Booking status updated successfully');
    
    return true;
  } catch (error) {
    console.error('Error updating booking status in Firestore:', error);
    return false;
  }
};

export const deleteBookingFromFirestore = async (bookingId) => {
  try {
    const { db, doc, deleteDoc } = await getFirestoreUtils();
    const bookingDoc = doc(db, 'bookings', bookingId);
    
    console.log('Deleting booking from Firestore:', bookingId);
    await deleteDoc(bookingDoc);
    console.log('Booking deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting booking from Firestore:', error);
    return false;
  }
};

// ── UTILITY FUNCTIONS ──

export const checkFirebaseConnection = async () => {
  try {
    const { db, collection, getDocs } = await getFirestoreUtils();
    // Try to read from a collection to test connection
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('Firebase connection test successful');
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Convert reel to portfolio item format (same as before)
export const reelToPortfolioItem = (reel) => ({
  id: reel.id,
  cat: reel.eventType || 'Client Work',
  title: reel.title,
  symbol: '▶',
  isReel: true,
  videoUrl: reel.videoUrl,
  thumbnailUrl: reel.thumbnailUrl,
  clientName: reel.clientName
});