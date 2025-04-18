export const takeScreenshot = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ 
      preferCurrentTab: true,
      video: { 
        // @ts-expect-error mediaSource is a valid property for getDisplayMedia in some browsers
        mediaSource: 'screen' 
      }
    });
    
    const video = document.createElement('video');
    video.srcObject = stream;
    await new Promise(resolve => video.onloadedmetadata = resolve);
    video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve) => 
      canvas.toBlob((blob) => resolve(blob!), 'image/png')
    );

    let success = false;
    if (navigator.clipboard && typeof window.ClipboardItem !== 'undefined') {
      try {
        const item = new window.ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        success = true;
      } catch {
        success = false;
      }
    }

    stream.getTracks().forEach(track => track.stop());
    return success;
  } catch (err) {
    console.error('Error taking screenshot:', err);
    return false;
  }
};
