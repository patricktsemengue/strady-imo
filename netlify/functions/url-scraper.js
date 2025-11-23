import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { get, set } from './cache.js';

export const handler = async (event) => {
  // --- CORS Preflight Handling ---
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url } = JSON.parse(event.body);
    if (!url || !url.startsWith('http')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'A valid URL is required.' }) };
    }

    // --- CACHE ---
    const cachedData = get(url);
    if (cachedData) {
      console.log(`[INFO] Scraping URL from cache: ${url}`);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ content: cachedData }),
      };
    }

    console.log(`[INFO] Scraping URL: ${url}`);
    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const virtualConsole = new JSDOM().window.console; // Create a virtual console
    const dom = new JSDOM(html, { virtualConsole, runScripts: "outside-only" }); // Pass it to the constructor
    // Extract text content from the body to simplify the data for the AI
    const textContent = dom.window.document.body.textContent || "";
    const cleanedContent = textContent.replace(/\s\s+/g, ' ').trim();

    // --- MISE EN CACHE ---
    set(url, cleanedContent);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ content: cleanedContent }), // Clean up whitespace
    };

  } catch (error) {
    console.error('[FATAL_ERROR] Error in url-scraper:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};