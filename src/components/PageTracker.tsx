"use client";

import { useEffect, useRef } from "react";
import { trackActivity, ActivityType } from "@/lib/tracking";

interface PageTrackerProps {
    activityType?: ActivityType;
    contentType: string;
    contentId?: string;
    metadata?: Record<string, any>;
}

export default function PageTracker({
    activityType = "PAGE_VIEW",
    contentType,
    contentId,
    metadata
}: PageTrackerProps) {

    // Ref prevents double-firing in React StrictMode
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!hasTracked.current) {
            trackActivity({
                activity_type: activityType,
                content_type: contentType,
                content_id: contentId,
                metadata
            });
            hasTracked.current = true;
        }
    }, [activityType, contentType, contentId, metadata]);

    // Render nothing
    return null;
}
