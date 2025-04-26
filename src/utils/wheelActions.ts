import { ToastContextType } from '../components/ui/ToastTypes';

/**
 * Copies the wheel's shareable link to the clipboard.
 * @param wheelId - The ID of the wheel.
 * @param showToast - Function to display toast notifications.
 */
export const shareWheelLink = (
  wheelId: string, 
  showToast: ToastContextType['showToast']
): void => {
  try {
    if (!wheelId) {
      throw new Error('Wheel ID is missing, cannot generate share link.');
    }
    const url = `${window.location.origin}/${wheelId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        showToast('Link copied!', 'success');
      })
      .catch((error) => {
        console.error('Copy to clipboard error:', error);
        showToast('Failed to copy link', 'error');
      });
  } catch (error) {
    console.error('Share error:', error);
    const message = error instanceof Error ? error.message : 'Failed to share link';
    showToast(message, 'error');
  }
};
