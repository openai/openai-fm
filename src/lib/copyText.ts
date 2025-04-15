/**
 * Utility for copying text in a cross-browser way
 *
 * @param {string} text
 * @param {HTMLElement} container - Fallback copy method requires appending a textarea
 *   to the DOM and focusing it. If you don't want to shift focus out of the currently
 *   focused container (e.g. a popover) you can specify a custom container to append
 *   the textarea to keep focus in that container. This need for this edge case is
 *   exceedingly rare as navigator.clipboard.writeText support expands.
 * @returns
 */
export async function copyText(
  text: string,
  container: HTMLElement = document.body
): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      // Try to use the navigator.clipboard method first
      await navigator.clipboard.writeText(text);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // If that doesn't work, we continue on to the fallback method below
    }
  }

  // Fallback method
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid visibility/interaction
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.opacity = "0";

  container.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Ignore
  }
  container.removeChild(textArea);
  return succeeded;
}
