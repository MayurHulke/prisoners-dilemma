/**
 * Safe DOM Utilities
 * Provides XSS-safe alternatives to innerHTML and sanitizes Firebase data
 */

/**
 * Sanitize data from Firebase before displaying
 * Firebase has no authentication, so data could theoretically be malicious
 * @param {any} data - Data from Firebase
 * @param {string} type - Expected data type ('number', 'string', 'boolean')
 * @returns {any} Sanitized data
 */
export function sanitizeFirebaseData(data, type = 'number') {
    if (type === 'number') {
        const num = Number(data);
        if (!isFinite(num) || isNaN(num)) return 0;
        // Clamp to reasonable game values
        return Math.max(0, Math.min(10000, num));
    }

    if (type === 'string') {
        // Escape HTML characters
        const div = document.createElement('div');
        div.textContent = String(data);
        return div.innerHTML;
    }

    if (type === 'boolean') {
        return Boolean(data);
    }

    return data;
}

/**
 * Safely format a number for display
 * Prevents NaN, Infinity, and extremely large numbers
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export function safeNumberFormat(value, decimals = 0) {
    const num = Number(value);
    if (!isFinite(num) || isNaN(num)) return '0';

    // Clamp to reasonable display range
    const clamped = Math.max(-999999, Math.min(999999, num));
    return decimals > 0 ? clamped.toFixed(decimals) : Math.round(clamped).toString();
}

/**
 * Safely format a percentage for display
 * @param {number} value - Number (0-100)
 * @returns {string}
 */
export function safePercentFormat(value) {
    const num = Number(value);
    if (!isFinite(num) || isNaN(num)) return '0%';
    const clamped = Math.max(0, Math.min(100, num));
    return Math.round(clamped) + '%';
}

/**
 * Validate and sanitize game state data
 * Ensures game data has expected structure and safe values
 * @param {Object} gameData - Game data object
 * @param {Object} schema - Expected schema with types
 * @returns {Object} Sanitized game data
 */
export function validateGameData(gameData, schema) {
    const sanitized = {};

    for (const [key, expectedType] of Object.entries(schema)) {
        if (gameData.hasOwnProperty(key)) {
            sanitized[key] = sanitizeFirebaseData(gameData[key], expectedType);
        } else {
            // Set default value based on type
            sanitized[key] = expectedType === 'number' ? 0 :
                            expectedType === 'boolean' ? false : '';
        }
    }

    return sanitized;
}

/**
 * Security note for innerHTML usage:
 *
 * innerHTML is used throughout the games for rendering UI with trusted, hardcoded content.
 * This is SAFE because:
 * 1. All HTML strings come from game logic, not user input
 * 2. No Firebase data contains HTML (only numbers and booleans)
 * 3. All Firebase numbers are sanitized before display
 *
 * If you add user-generated content in the future (like usernames or comments),
 * you MUST use sanitizeFirebaseData() before displaying it.
 */
