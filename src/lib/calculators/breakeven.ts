/**
 * Break-Even Point Calculator
 * Calculates when investments will pay off
 */

export interface BreakEvenInput {
  investmentCost: number;
  monthlySavings: number;
  monthlyRevenueIncrease: number;
  rampUpTime: number; // Months
}

export interface BreakEvenResult {
  breakEvenMonths: number;
  breakEvenDate: string;
  totalBenefits: number;
  netBenefit: number;
  roi: number;
  netROI: number;
  paybackPeriod: number;
  totalBenefit: number;
  scenarios: {
    conservative: {
      roi: number;
      payback: number;
    };
    realistic: {
      roi: number;
      payback: number;
    };
    optimistic: {
      roi: number;
      payback: number;
    };
  };
}

/**
 * Calculate break-even point
 */
export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const { investmentCost, monthlySavings, monthlyRevenueIncrease, rampUpTime } = input;

  // Total monthly benefit
  const monthlyBenefit = monthlySavings + monthlyRevenueIncrease;

  // Simple break-even (without ramp-up)
  const simpleBreakEven = investmentCost / monthlyBenefit;

  // Account for ramp-up time
  let breakEvenMonths = simpleBreakEven;
  let cumulativeBenefit = 0;
  let month = 0;

  while (cumulativeBenefit < investmentCost && month < 60) {
    month++;
    // Gradual ramp-up benefit
    const rampUpFactor = month <= rampUpTime ? month / rampUpTime : 1;
    cumulativeBenefit += monthlyBenefit * rampUpFactor;
  }

  breakEvenMonths = month;

  // Calculate break-even date
  const breakEvenDate = new Date();
  breakEvenDate.setMonth(breakEvenDate.getMonth() + Math.ceil(breakEvenMonths));

  // Total benefits over 12 months
  const totalBenefits = monthlyBenefit * 12;

  // Net ROI
  const netROI = ((totalBenefits - investmentCost) / investmentCost) * 100;

  // Payback period
  const paybackPeriod = investmentCost / monthlyBenefit;

  // Scenario analysis - calculate different benefit scenarios
  const conservativeBenefit = monthlyBenefit * 0.8; // 20% worse
  const realisticBenefit = monthlyBenefit; // Base case
  const optimisticBenefit = monthlyBenefit * 1.2; // 20% better

  // Calculate payback periods for each scenario
  const conservativePayback = investmentCost / conservativeBenefit;
  const realisticPayback = breakEvenMonths;
  const optimisticPayback = investmentCost / optimisticBenefit;

  // Calculate ROI for each scenario (3-year projection)
  const conservativeTotalBenefit = conservativeBenefit * 36;
  const realisticTotalBenefit = realisticBenefit * 36;
  const optimisticTotalBenefit = optimisticBenefit * 36;

  const conservativeROI = ((conservativeTotalBenefit - investmentCost) / investmentCost) * 100;
  const realisticROI = ((realisticTotalBenefit - investmentCost) / investmentCost) * 100;
  const optimisticROI = ((optimisticTotalBenefit - investmentCost) / investmentCost) * 100;

  // Net benefit (total benefits - investment)
  const netBenefit = totalBenefits - investmentCost;

  return {
    breakEvenMonths: Math.round(breakEvenMonths * 10) / 10,
    breakEvenDate: breakEvenDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    totalBenefits: Math.round(totalBenefits),
    netBenefit: Math.round(netBenefit),
    roi: Math.round(netROI * 10) / 10,
    netROI: Math.round(netROI * 10) / 10,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    totalBenefit: Math.round(realisticTotalBenefit),
    scenarios: {
      conservative: {
        roi: Math.round(conservativeROI * 10) / 10,
        payback: Math.round(conservativePayback * 10) / 10,
      },
      realistic: {
        roi: Math.round(realisticROI * 10) / 10,
        payback: Math.round(realisticPayback * 10) / 10,
      },
      optimistic: {
        roi: Math.round(optimisticROI * 10) / 10,
        payback: Math.round(optimisticPayback * 10) / 10,
      },
    },
  };
}

