import { WebContainer } from '@webcontainer/api';

let webcontainerPromise: Promise<WebContainer> | null = null;

export async function getWebContainerInstance(): Promise<WebContainer> {
  if (webcontainerPromise) {
    return webcontainerPromise;
  }

  try {
    console.log("Booting WebContainer...");
    webcontainerPromise = WebContainer.boot(); 
    
    const instance = await webcontainerPromise; 
    console.log("WebContainer successfully booted!");
    return instance;
  } catch (error) {
    console.error("Failed to boot WebContainer:", error);
    webcontainerPromise = null; // Reset on failure so we can try again
    throw error;
  }
}