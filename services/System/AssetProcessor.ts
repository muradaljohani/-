
import React from 'react';
import { OFFICIAL_SEAL_CONFIG } from '../../constants/officialAssets';

/**
 * ==============================================================================
 * ASSET PROCESSOR ENGINE (The Smart Seal Protocol)
 * Layer: System Core
 * Handles: Asset retrieval, composition logic, and transparency simulation.
 * ==============================================================================
 */

export class AssetProcessor {
    private static instance: AssetProcessor;

    private constructor() {}

    public static getInstance(): AssetProcessor {
        if (!AssetProcessor.instance) {
            AssetProcessor.instance = new AssetProcessor();
        }
        return AssetProcessor.instance;
    }

    /**
     * Retrieves the Official Seal Base64 String.
     * Guaranteed to exist.
     */
    public getOfficialSeal(): string {
        return OFFICIAL_SEAL_CONFIG.seal;
    }

    /**
     * Retrieves the CEO Signature Base64 String.
     */
    public getOfficialSignature(): string {
        return OFFICIAL_SEAL_CONFIG.signature;
    }

    /**
     * Generates CSS styles for the "Realistic Stamp" effect.
     * FAIL-SAFE UPDATE: Removed 'drop-shadow' filter.
     * Complex CSS filters are the #1 cause of html2canvas/PDF rendering issues.
     * We rely on the SVG's internal alpha channel and a simple mix-blend-mode.
     */
    public getStampStyle(rotation: number = -3): React.CSSProperties {
        return {
            transform: `rotate(${rotation}deg)`,
            opacity: 0.9,
            // mix-blend-mode allows the stamp to look like ink on paper, 
            // but we ensure the image itself is visible even if blend mode fails.
            mixBlendMode: 'multiply' as any
        };
    }

    /**
     * Generates CSS styles for the Signature.
     */
    public getSignatureStyle(): React.CSSProperties {
        return {
            opacity: 0.9,
            mixBlendMode: 'multiply' as any
        };
    }
}
