import axios from "axios";

export async function getContactInfo(phoneNumber) {
  const tokenForOnCloudApi = process.env.ONCLOUD_API_TOKEN;
  var apiUrl = process.env.ONCLOUD_API_URL;

  // Basic validation to ensure we have the necessary parts
  if (!tokenForOnCloudApi || !apiUrl || !phoneNumber) {
    console.error('Missing required environment variables or phone number.');
    // Throw an error or return a specific error object
    throw new Error('Configuration error: API token, URL, or phone number is missing.');
  }

  const finalUrl = `${apiUrl}?token=${tokenForOnCloudApi}&phone=${phoneNumber}`;

  try {
    // Attempt the API call
    const result = await axios.get(finalUrl);

    // If successful (HTTP status 200-299), return the data
    return result.data.contact;

  } catch (error) {
    // --- Error Handling Block ---

    if (axios.isAxiosError(error)) {
      // 1. Handle errors related to the HTTP request itself (e.g., status codes 4xx or 5xx)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(`API Call Failed (Status: ${error.response.status}):`, error.response.data);
        // Throw an error with specific status information
        throw new Error(`Failed to get contact info. Server responded with status ${error.response.status}.`);

      } else if (error.request) {
        // The request was made but no response was received 
        // (e.g., network timeout, service unavailable)
        console.error('API Call Failed: No response received from server.');
        throw new Error('Network error: Could not reach the API server.');

      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('API Call Setup Error:', error.message);
        throw new Error(`Request setup error: ${error.message}`);
      }
    } else {
      // 2. Handle non-Axios-specific errors (e.g., an error thrown inside the try block before the Axios call)
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred during API call execution.');
    }
  }
}