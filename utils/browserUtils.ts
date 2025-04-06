export const isBrowser = typeof window !== 'undefined';

export const downloadFile = (url: string, filename?: string) => {
  if (!isBrowser) return false;
  
  try {
    const link = document.createElement('a');
    link.href = url;
    if (filename) link.setAttribute('download', filename);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
    }, 2000);
    
    return true;
  } catch (error) {
    console.error("Download error:", error);
    return false;
  }
};