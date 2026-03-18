// Shared storage utility for bookings - now using Firebase Firestore
import { 
  saveBookingToFirestore, 
  getBookingsFromFirestore, 
  updateBookingStatusInFirestore,
  deleteBookingFromFirestore 
} from './firebase.js';

export const getStoredBookings = async () => {
  try {
    return await getBookingsFromFirestore();
  } catch (error) {
    console.error('Error loading bookings:', error);
    // Fallback to localStorage if Firebase fails
    try {
      const bookings = localStorage.getItem('vowMomentsBookings');
      return bookings ? JSON.parse(bookings) : [];
    } catch (localError) {
      console.error('Error loading from localStorage:', localError);
      return [];
    }
  }
};

export const saveBooking = async (booking) => {
  try {
    const savedBooking = await saveBookingToFirestore(booking);
    
    // Also save to localStorage as backup
    try {
      const existingBookings = localStorage.getItem('vowMomentsBookings');
      const bookings = existingBookings ? JSON.parse(existingBookings) : [];
      bookings.push(savedBooking);
      localStorage.setItem('vowMomentsBookings', JSON.stringify(bookings));
    } catch (localError) {
      console.warn('Could not save to localStorage backup:', localError);
    }
    
    return savedBooking;
  } catch (error) {
    console.error('Error saving booking:', error);
    return null;
  }
};

export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const success = await updateBookingStatusInFirestore(bookingId, newStatus);
    
    // Also update localStorage backup
    if (success) {
      try {
        const existingBookings = localStorage.getItem('vowMomentsBookings');
        if (existingBookings) {
          const bookings = JSON.parse(existingBookings);
          const updatedBookings = bookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: newStatus } : booking
          );
          localStorage.setItem('vowMomentsBookings', JSON.stringify(updatedBookings));
        }
      } catch (localError) {
        console.warn('Could not update localStorage backup:', localError);
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    const success = await deleteBookingFromFirestore(bookingId);
    
    // Also remove from localStorage backup
    if (success) {
      try {
        const existingBookings = localStorage.getItem('vowMomentsBookings');
        if (existingBookings) {
          const bookings = JSON.parse(existingBookings);
          const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
          localStorage.setItem('vowMomentsBookings', JSON.stringify(updatedBookings));
        }
      } catch (localError) {
        console.warn('Could not update localStorage backup:', localError);
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error deleting booking:', error);
    return false;
  }
};