/**
 * Esquared Construction Calculator Module
 * Estimates construction costs based on area, type, and finish.
 */

// Cost Constants (in PHP equivalent units or generic currency)
const BASE_RATES = {
    STRUCTURAL: 12000,
    ARCHITECTURAL: 8000,
    MEP: 4000 // Mechanical, Electrical, Plumbing
};

const FINISH_MULTIPLIERS = {
    basic: 0.8,    // Rough/Basic Finish
    standard: 1.0, // Standard Finish
    premium: 1.5   // Luxury Finish
};

const LOCATION_ADJUSTMENTS = {
    metro: 1.0,
    provincial: 1.15, // Logistics cost
    remote: 1.3
};

const TYPE_MULTIPLIERS = {
    residential: 1.0,
    commercial: 1.25 // Higher compliance/structural reqs
};

export class Calculator {
    static calculate(data) {
        const { area, floors, type, finish, location } = data;
        
        const totalArea = parseFloat(area) * parseInt(floors);
        const finishMult = FINISH_MULTIPLIERS[finish] || 1.0;
        const locMult = LOCATION_ADJUSTMENTS[location] || 1.0;
        const typeMult = TYPE_MULTIPLIERS[type] || 1.0;
        
        const compositeMult = finishMult * locMult * typeMult;

        // Breakdown Calculation
        const structural = (BASE_RATES.STRUCTURAL * totalArea) * (locMult * typeMult); // Finish doesn't affect structure much
        const architectural = (BASE_RATES.ARCHITECTURAL * totalArea) * compositeMult;
        const mep = (BASE_RATES.MEP * totalArea) * compositeMult;
        
        const subtotal = structural + architectural + mep;
        const labor = subtotal * 0.35; // 35% Labor estimate
        const contingency = subtotal * 0.10; // 10% buffers
        
        const total = subtotal + labor + contingency;

        return {
            details: {
                totalArea,
                structural,
                architectural,
                mep,
                labor,
                contingency
            },
            totalEstimate: total
        };
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    }
}
