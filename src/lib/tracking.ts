// src/lib/tracking.ts

/**
 * Valid activity types for the platform
 */
export type ActivityType =
    | 'PAGE_VIEW'
    | 'SEARCH'
    | 'CTA_CLICK'
    | 'BOOKING_INITIATED'
    | 'LOGIN';

/**
 * Base tracking payload
 */
interface TrackPayload {
    activity_type: ActivityType;
    content_type?: string;
    content_id?: string;
    metadata?: Record<string, any>;
}

/**
 * Sends a tracking event to the internal /api/activity/track endpoint.
 * Silently fails on error to prevent blocking user flows.
 */
export const trackActivity = async (payload: TrackPayload) => {
    try {
        await fetch('/api/activity/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            // Keepalive ensures the request finishes if the user navigates away immediately
            keepalive: true,
        });
    } catch (error) {
        console.error('Failed to track activity:', error);
    }
};
