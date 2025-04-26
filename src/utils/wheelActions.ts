import { ToastContextType } from '../components/ui/ToastTypes';
import { takeScreenshot } from './screenshot'; // Import the screenshot utility

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

/**
 * Takes a screenshot of the current screen/tab and copies it to the clipboard.
 * @param showToast - Function to display toast notifications.
 */
export const takeWheelScreenshot = async (showToast: ToastContextType['showToast']): Promise<void> => {
  try {
    // takeScreenshot captures the screen/tab, not a specific element
    const success = await takeScreenshot();
    if (success) {
      showToast('Screenshot copied!', 'success');
    } else {
      // Some browsers might not support clipboard API for images, 
      // or the user might cancel the screen share
      showToast('Failed to copy screenshot to clipboard.', 'warning'); 
    }
  } catch (error) {
    console.error('Screenshot error:', error);
    const message = error instanceof Error ? error.message : 'Failed to take screenshot';
    showToast(message, 'error');
  }
};
