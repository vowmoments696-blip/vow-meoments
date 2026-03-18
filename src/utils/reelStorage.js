// Shared storage utility for reels - now using Firebase Firestore
import { 
  saveReelToFirestore, 
  getReelsFromFirestore, 
  deleteReelFromFirestore,
  reelToPortfolioItem 
} from './firebase.js';

export const getStoredReels = async () => {
  try {
    return await getReelsFromFirestore();
  } catch (error) {
    console.error('Error loading reels:', error);
    // Fallback to localStorage if Firebase fails
    try {
      const reels = localStorage.getItem('vowMomentsReels');
      return reels ? JSON.parse(reels) : [];
    } catch (localError) {
      console.error('Error loading from localStorage:', localError);
      return [];
    }
  }
};

export const saveReel = async (reel) => {
  try {
    const savedReel = await saveReelToFirestore(reel);
    
    // Also save to localStorage as backup
    try {
      const existingReels = localStorage.getItem('vowMomentsReels');
      const reels = existingReels ? JSON.parse(existingReels) : [];
      reels.push(savedReel);
      localStorage.setItem('vowMomentsReels', JSON.stringify(reels));
    } catch (localError) {
      console.warn('Could not save to localStorage backup:', localError);
    }
    
    return savedReel;
  } catch (error) {
    console.error('Error saving reel:', error);
    return null;
  }
};

export const deleteReel = async (reelId) => {
  try {
    const success = await deleteReelFromFirestore(reelId);
    
    // Also remove from localStorage backup
    if (success) {
      try {
        const existingReels = localStorage.getItem('vowMomentsReels');
        if (existingReels) {
          const reels = JSON.parse(existingReels);
          const updatedReels = reels.filter(reel => reel.id !== reelId);
          localStorage.setItem('vowMomentsReels', JSON.stringify(updatedReels));
        }
      } catch (localError) {
        console.warn('Could not update localStorage backup:', localError);
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error deleting reel:', error);
    return false;
  }
};

// Convert reel to portfolio item format
export { reelToPortfolioItem };