class Gas {
  // inputs
  private _spgr: number;
  private _h2s: number;
  private _co2: number;
  private _n2: number;

  constructor(spgr?: number, h2s?: number, co2?: number, n2?: number) {
    this._spgr = (spgr == null) ? 0.65 : spgr;
    this._h2s = (h2s == null) ? 0.0 : h2s;
    this._co2 = (co2 == null) ? 0.0 : co2;
    this._n2 = (n2 == null) ? 0.0 : n2;
  }

  set spgr(val: number) {
    this._spgr = val;
  }

  get spgr(): number {
    return this._spgr;
  }

  set h2s(val: number) {
    this._h2s = val;
  }
  get h2s(): number {
    return this._h2s;
  }

  set co2(val: number) {
    this._co2 = val;
  }
  get co2(): number {
    return this._co2;
  }

  set n2(val: number) {
    this._n2 = val;
  }
  get n2(): number {
    return this._n2;
  }


}


class GasProperties {
  private _pressure: number = 0.0;
  private _temperature: number = 0.0;
  private _zfactor: number = 0.0;
  private _gasFormationVolumeFactor: number = 0.0;
  private _gasViscosity: number = 0.0;
  private _gasDensity: number = 0.0;

  set pressure(value: number) {
    this._pressure = value;
  }
  set temperature(value: number) {
    this._temperature = value;
  }

  // set zfactor(value:number){
  //   this._zfactor=value;
  // }
  // get zfactor():number{
  //   return this._zfactor;
  // }

  // set gasFormationVolumeFactor(value:number){
  //   this._gasFormationVolumeFactor=value;
  // }
  // get gasFormationVolumeFactor():number{
  //   return this._gasFormationVolumeFactor;
  // }

  // set gasViscosity(value:number){
  //   this._gasViscosity=value;
  // }
  // get gasViscosity():number{
  //   return this._gasViscosity;
  // }

  // set gasDensity(value:number){
  //   this._gasDensity=value;
  // }
  // get gasDensity():number{
  //   return this._gasDensity;
  // }

  /**
   * Calculates the gas Z-factor utilizing Standing (1977) pseudo-critical properties,
   * Wichert-Aziz acid gas correction, and Hall-Yarborough correlation.
   * @param spgr Gas specific gravity (relative to air)
   * @param h2sPercentage Molar percentage of H2S
   * @param co2Percentage Molar percentage of CO2
   * @param pressure Pressure (psia)
   * @param temperature Temperature (Fahrenheit)
   * @returns Compressibility factor Z
   */
  public calculateZFactor(spgr: number, h2sPercentage: number, co2Percentage: number, pressure: number, temperature: number): number {
    const h2sFraction = h2sPercentage / 100.0;
    const co2Fraction = co2Percentage / 100.0;
    const tempRankine = temperature + 459.67;

    // Standing (1977) pseudo-critical properties
    let Tpc = 168.0 + 325.0 * spgr - 12.5 * Math.pow(spgr, 2);
    let Ppc = 677.0 + 15.0 * spgr - 37.5 * Math.pow(spgr, 2);

    // Wichert-Aziz acid gas correction
    const A = h2sFraction + co2Fraction;
    const B = h2sFraction;
    if (A > 0) {
      const epsilon = 120.0 * (Math.pow(A, 0.9) - Math.pow(A, 1.6)) + 15.0 * (Math.pow(B, 0.5) - Math.pow(B, 4.0));
      Tpc = Tpc - epsilon;
      Ppc = (Ppc * Tpc) / (Tpc + B * (1.0 - B) * epsilon);
    }

    const Tpr = tempRankine / Tpc;
    const Ppr = pressure / Ppc;

    // Hall-Yarborough calculation for Z-factor
    const t_r = 1.0 / Tpr;
    const X1 = -0.06125 * Ppr * t_r * Math.exp(-1.2 * Math.pow((1.0 - t_r), 2));
    const X2 = 14.76 * t_r - 9.76 * Math.pow(t_r, 2) + 4.58 * Math.pow(t_r, 3);
    const X3 = 90.7 * t_r - 242.2 * Math.pow(t_r, 2) + 42.4 * Math.pow(t_r, 3);
    const X4 = 2.18 + 2.82 * t_r;

    // Initial guess for Y
    let Y = 0.0125 * Ppr * t_r * Math.exp(-1.2 * Math.pow((1.0 - t_r), 2));

    // Newton-Raphson iteration
    for (let i = 0; i < 500; i++) {
      const Y2 = Math.pow(Y, 2);
      const Y3 = Math.pow(Y, 3);
      const Y4 = Math.pow(Y, 4);

      const fY = X1 + (Y + Y2 + Y3 - Y4) / Math.pow((1.0 - Y), 3) - X2 * Y2 + X3 * Math.pow(Y, X4);
      const dfY = (1.0 + 4.0 * Y + 4.0 * Y2 - 4.0 * Y3 + Y4) / Math.pow((1.0 - Y), 4) - 2.0 * X2 * Y + X3 * X4 * Math.pow(Y, X4 - 1.0);

      if (dfY === 0) break; // prevent division by zero

      const dY = fY / dfY;
      Y = Y - dY;

      if (Math.abs(dY) < 1e-8) {
        break;
      }
    }

    this._zfactor = -X1 / Y;
    if (this._zfactor < 0 || isNaN(this._zfactor)) {
      this._zfactor = 1.0; // fallback if calculation diverges
    }

    // Update internal state
    this._pressure = pressure;
    this._temperature = temperature;

    return this._zfactor;
  }

  /**
   * Calculates the gas density (in lb/ft3).
   * @param spgr Gas specific gravity
   * @param pressure Pressure in psia
   * @param temperature Temperature in Fahrenheit
   * @param zfactor Gas Z-factor
   * @returns Density in lb/ft^3
   */
  public calculateGasDensity(spgr: number, pressure: number, temperature: number, zfactor: number): number {
    const tempRankine = temperature + 459.67;
    // Density (lb/ft3) = P * MW / (Z * R * T)
    // MW = 28.966 * spgr. R = 10.732 psia ft3 / (lb-mol R).
    this._gasDensity = (2.699 * spgr * pressure) / (zfactor * tempRankine);
    return this._gasDensity;
  }

  /**
   * Calculates the Gas Formation Volume Factor (Bg) in ft3/scf.
   * Standard conditions assumed as 14.7 psia and 60 deg F.
   * @param pressure Pressure in psia
   * @param temperature Temperature in Fahrenheit
   * @param zfactor Gas Z-factor
   * @returns Bg in ft3/scf
   */
  public calculateGasFormationVolumeFactor(pressure: number, temperature: number, zfactor: number): number {
    const tempRankine = temperature + 459.67;
    // Bg = (Psc * Z * T) / (P * Zsc * Tsc) 
    // Using Psc = 14.7 psia and Tsc = 519.67 R
    this._gasFormationVolumeFactor = (14.7 * zfactor * tempRankine) / (519.67 * pressure);
    return this._gasFormationVolumeFactor;
  }

  /**
   * Calculates gas viscosity using Lee, Gonzalez, and Eakin (1966) method.
   * @param spgr Gas specific gravity
   * @param pressure Pressure in psia
   * @param temperature Temperature in Fahrenheit
   * @param zfactor Gas Z-factor
   * @returns Viscosity in centipoise (cp)
   */
  public calculateGasViscosity(spgr: number, pressure: number, temperature: number, zfactor: number): number {
    const tempRankine = temperature + 459.67;
    const MW = 28.966 * spgr;

    // Density in g/cc for Lee-Gonzalez-Eakin equations
    const densityGCC = 1.4935e-3 * pressure * MW / (zfactor * tempRankine);

    const K = ((9.379 + 0.01607 * MW) * Math.pow(tempRankine, 1.5)) / (209.2 + 19.26 * MW + tempRankine);
    const X = 3.448 + (986.4 / tempRankine) + 0.01009 * MW;
    const Y = 2.447 - 0.2224 * X;

    this._gasViscosity = K * 1e-4 * Math.exp(X * Math.pow(densityGCC, Y));
    return this._gasViscosity;
  }
}

export { Gas, GasProperties };