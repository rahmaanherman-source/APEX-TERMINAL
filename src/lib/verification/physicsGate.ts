export interface ThermosiphonInputs {
  hotTemperatureC: number;
  coldTemperatureC: number;
  heightM: number;
  diameterM: number;
  claimedElectricalPowerW: number;
  assumedHydraulicEfficiency?: number;
}

export interface PhysicsGateResult {
  status: "PLAUSIBLE" | "INVALID";
  claimState: "SUPPORTED" | "REFUTED" | "UNKNOWN";
  deltaRhoKgM3: number;
  buoyancyPressurePa: number;
  requiredFlowM3s: number;
  requiredVelocityMs: number;
  areaM2: number;
  reason: string;
}

function waterDensityApproxKgM3(tempC: number): number {
  // Engineering first-order approximation near 0–40 C.
  // Runtime production models should use a validated fluid-property source.
  return 999.842594
    + 6.793952e-2 * tempC
    - 9.09529e-3 * tempC ** 2
    + 1.001685e-4 * tempC ** 3
    - 1.120083e-6 * tempC ** 4
    + 6.536332e-9 * tempC ** 5;
}

export function firstOrderThermosiphonCheck(input: ThermosiphonInputs): PhysicsGateResult {
  const g = 9.80665;
  const hotRho = waterDensityApproxKgM3(input.hotTemperatureC);
  const coldRho = waterDensityApproxKgM3(input.coldTemperatureC);
  const deltaRho = Math.abs(coldRho - hotRho);
  const buoyancyPressurePa = deltaRho * g * input.heightM;
  const areaM2 = Math.PI * (input.diameterM / 2) ** 2;

  if (buoyancyPressurePa <= 0 || areaM2 <= 0 || input.claimedElectricalPowerW <= 0) {
    return {
      status: "INVALID",
      claimState: "REFUTED",
      deltaRhoKgM3: deltaRho,
      buoyancyPressurePa,
      requiredFlowM3s: Infinity,
      requiredVelocityMs: Infinity,
      areaM2,
      reason: "Non-positive physical input cannot support a positive claimed output."
    };
  }

  const efficiency = input.assumedHydraulicEfficiency ?? 1;
  const requiredFlowM3s = input.claimedElectricalPowerW / (buoyancyPressurePa * efficiency);
  const requiredVelocityMs = requiredFlowM3s / areaM2;

  // First-order gate: this deliberately detects magnitude failures before expensive design work.
  // It is not a replacement for a full loop/friction/heat-transfer model.
  const magnitudeClearlyImpossible = requiredVelocityMs > 10;

  return {
    status: magnitudeClearlyImpossible ? "INVALID" : "PLAUSIBLE",
    claimState: magnitudeClearlyImpossible ? "REFUTED" : "UNKNOWN",
    deltaRhoKgM3: deltaRho,
    buoyancyPressurePa,
    requiredFlowM3s,
    requiredVelocityMs,
    areaM2,
    reason: magnitudeClearlyImpossible
      ? "Required flow velocity is incompatible with a first-order passive thermosiphon magnitude check; run detailed hydraulic/thermal modeling before release."
      : "First-order magnitude check did not reject the claim; detailed hydraulic, thermal, turbine, generator, and physical testing are still required."
  };
}

export function manufacturingGate(physics: PhysicsGateResult): "ALLOWED_TO_DESIGN" | "BLOCKED" {
  return physics.status === "INVALID" ? "BLOCKED" : "ALLOWED_TO_DESIGN";
}
