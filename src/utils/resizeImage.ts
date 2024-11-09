function getResizedImg(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (imageUrl === "") {
        resolve("");
      }
      const img = new Image();
      img.src = imageUrl;
  
      img.onload = () => {
        // Get original image dimensions
        const originalWidth = img.width;
        const originalHeight = img.height;
  
        // Set target dimensions
        const targetWidth = 600;
        const targetHeight = 400;
  
        // If the image is larger than the target, resize it
        let newWidth = originalWidth;
        let newHeight = originalHeight;
  
        if (originalWidth > targetWidth || originalHeight > targetHeight) {
          newWidth = targetWidth;
          newHeight = targetHeight;
        }
  
        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (ctx) {
          canvas.width = newWidth;
          canvas.height = newHeight;
  
          // Draw the image onto the canvas with new dimensions
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
          // Convert the canvas to base64 JPEG
          const base64Image = canvas.toDataURL('image/jpeg');
          resolve(base64Image);
        } else {
          reject('Canvas context not available');
        }
      };
  
      img.onerror = (error) => {
        reject('Error loading image: ' + error);
      };
    });
}
  
export default getResizedImg;