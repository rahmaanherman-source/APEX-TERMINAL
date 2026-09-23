export interface ThermosiphonLoop {
  heightM: number;
  totalPipeLengthM: number;
  diameterM: number;
  roughnessM: number;
  minorLossK: number;
  hotTemperatureC: number;
  coldTemperatureC: number;
  claimedHeatW: number;
  cpJPerKgK?: number;
  viscosityPaS?: number;
}

export interface ThermosiphonProof {
  result: "PASS" | "FAIL";
  status: "VALID" | "INVALID";
  claimState: "SUPPORTED" | "REFUTED" | "UNKNOWN";
  buoyancyHeadPa: number;
  equilibriumFlowM3s: number;
  equilibriumMassFlowKgS: number;
  transportedHeatW: number;
  frictionLossPa: number;
  safetyFactor: number;
  reynoldsNumber: number;
  frictionFactor: number;
  requiredMassFlowKgS: number;
  requiredFlowM3s: number;
  requiredVelocityMs: number;
  equilibriumVelocityMs: number;
  reason: string;
}

function rhoWater(tempC: number): number {
  return 999.842594
    + 6.793952e-2 * tempC
    - 9.09529e-3 * tempC ** 2
    + 1.001685e-4 * tempC ** 3
    - 1.120083e-6 * tempC ** 4
    + 6.536332e-9 * tempC ** 5;
}

function waterViscosityPaS(tempC: number): number {
  // Andrade approximation, suitable for a first-order screening model.
  const tK = tempC + 273.15;
  return 2.414e-5 * 10 ** (247.8 / (tK - 140));
}

function frictionFactor(re: number, relativeRoughness: number): number {
  if (re <= 0) return Infinity;
  if (re < 2300) return 64 / re;
  // Haaland explicit approximation for turbulent flow.
  return 1 / (-1.8 * Math.log10((relativeRoughness / 3.7) ** 1.11 + 6.9 / re)) ** 2;
}

export function validateThermosiphon(loop: ThermosiphonLoop): ThermosiphonProof {
  const g = 9.80665;
  const cp = loop.cpJPerKgK ?? 4180;
  const deltaT = Math.abs(loop.hotTemperatureC - loop.coldTemperatureC);
  const hotRho = rhoWater(loop.hotTemperatureC);
  const coldRho = rhoWater(loop.coldTemperatureC);
  const rho = (hotRho + coldRho) / 2;
  const mu = loop.viscosityPaS ?? waterViscosityPaS((loop.hotTemperatureC + loop.coldTemperatureC) / 2);

  const area = Math.PI * loop.diameterM ** 2 / 4;
  const buoyancyHeadPa = Math.max(0, g * loop.heightM * (coldRho - hotRho));
  const requiredMassFlowKgS = deltaT > 0 ? loop.claimedHeatW / (cp * deltaT) : Infinity;
  const requiredFlowM3s = requiredMassFlowKgS / rho;
  const requiredVelocityMs = requiredFlowM3s / area;

  const lossAtVelocity = (velocity: number) => {
    const re = rho * Math.abs(velocity) * loop.diameterM / mu;
    const f = frictionFactor(re, loop.roughnessM / loop.diameterM);
    const major = f * (loop.totalPipeLengthM / loop.diameterM) * (rho * velocity ** 2 / 2);
    const minor = loop.minorLossK * (rho * velocity ** 2 / 2);
    return { loss: major + minor, re, f };
  };

  // Solve buoyancy = friction using a deterministic bisection search.
  let lo = 0;
  let hi = Math.max(requiredVelocityMs, 0.001);
  while (lossAtVelocity(hi).loss < buoyancyHeadPa && hi < 1000) hi *= 2;

  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (lossAtVelocity(mid).loss < buoyancyHeadPa) lo = mid;
    else hi = mid;
  }

  const equilibriumVelocityMs = (lo + hi) / 2;
  const eq = lossAtVelocity(equilibriumVelocityMs);
  const equilibriumFlowM3s = equilibriumVelocityMs * area;
  const equilibriumMassFlowKgS = equilibriumFlowM3s * rho;
  const transportedHeatW = equilibriumMassFlowKgS * cp * deltaT;

  const safetyFactor = buoyancyHeadPa > 0 ? buoyancyHeadPa / Math.max(eq.loss, 1e-12) : 0;
  const passes = transportedHeatW >= loop.claimedHeatW && buoyancyHeadPa >= eq.loss * 1.2;

  return {
    result: passes ? "PASS" : "FAIL",
    status: passes ? "VALID" : "INVALID",
    claimState: passes ? "SUPPORTED" : "REFUTED",
    buoyancyHeadPa,
    equilibriumFlowM3s,
    equilibriumMassFlowKgS,
    transportedHeatW,
    frictionLossPa: eq.loss,
    safetyFactor,
    reynoldsNumber: eq.re,
    frictionFactor: eq.f,
    requiredMassFlowKgS,
    requiredFlowM3s,
    requiredVelocityMs,
    equilibriumVelocityMs,
    reason: passes
      ? "First-order buoyancy/friction/thermal-load gate passed. Full thermal, transient, component, and physical validation remain required."
      : "First-order gate failed: the equilibrium thermosiphon flow cannot transport the claimed heat load with the required 1.2 pressure margin."
  };
}
