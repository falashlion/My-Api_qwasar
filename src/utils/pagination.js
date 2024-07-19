// Function to paginate results
export default function paginate(page, size) {
    // Validate and parse inputs
    const validatedPage = parseInt(page, 10);
    const validatedSize = parseInt(size, 10);
  
    // Check if inputs are valid integers
    if (isNaN(validatedPage) || isNaN(validatedSize) || validatedPage < 1 || validatedSize < 1) {
      throw new Error('Invalid page or size values');
    }
  
    // Calculate offset
    const offset = (validatedPage - 1) * validatedSize;
  
    // Return validated size and offset
    return { validatedSize, offset };
  }
  