
import { Shipment, Appointment, LegalContract } from '../../types';

/**
 * ==============================================================================
 * REALITY CORE (Physical Fulfillment Bridge)
 * Handles: Logistics, Time-Scheduling, and Legal Contracts
 * ==============================================================================
 */

export class RealityCore {
    private static instance: RealityCore;

    private constructor() {}

    public static getInstance(): RealityCore {
        if (!RealityCore.instance) {
            RealityCore.instance = new RealityCore();
        }
        return RealityCore.instance;
    }

    // --- ENGINE 1: MELAF EXPRESS (Logistics) ---
    
    public calculateShipping(fromCity: string, toCity: string): number {
        // Simplified Logic: Same city = 20 SAR, Different = 50 SAR
        if (fromCity.trim() === toCity.trim()) return 20;
        return 50;
    }

    public generateTrackingNumber(): string {
        return `TRK-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`;
    }

    public createShipment(data: {
        senderId: string, receiverId: string, fromCity: string, toCity: string
    }): Shipment {
        const cost = this.calculateShipping(data.fromCity, data.toCity);
        const tracking = this.generateTrackingNumber();
        
        return {
            id: `shp_${Date.now()}`,
            trackingNumber: tracking,
            senderId: data.senderId,
            receiverId: data.receiverId,
            fromCity: data.fromCity,
            toCity: data.toCity,
            status: 'Pending',
            cost: cost,
            labelUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tracking}`
        };
    }

    // --- ENGINE 2: TIME-LORD (Scheduler) ---

    public getAvailableSlots(date: string): string[] {
        // Mock: Returns random slots for demo
        return ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'];
    }

    public generateMeetingLink(): string {
        return `https://meet.google.com/abc-${Math.random().toString(36).substring(7)}-xyz`;
    }

    public bookAppointment(data: {
        hostId: string, guestId: string, type: 'Interview' | 'Service', date: string, timeSlot: string
    }): Appointment {
        return {
            id: `apt_${Date.now()}`,
            hostId: data.hostId,
            guestId: data.guestId,
            type: data.type,
            date: data.date,
            timeSlot: data.timeSlot,
            meetingLink: data.type === 'Interview' ? this.generateMeetingLink() : undefined,
            status: 'Confirmed'
        };
    }

    // --- ENGINE 3: IRON-CLAD (Contracts) ---

    public draftContract(data: {
        type: 'JobOffer' | 'BillOfSale',
        partyA: string, // Employer/Seller
        partyB: string, // Employee/Buyer
        terms: any
    }): LegalContract {
        return {
            id: `cnt_${Date.now()}`,
            type: data.type,
            partyA: data.partyA,
            partyB: data.partyB,
            terms: data.terms,
            signedA: false,
            signedB: false,
            createdAt: new Date().toISOString()
        };
    }
}
