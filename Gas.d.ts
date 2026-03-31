declare class Gas {
    private _spgr;
    private _h2s;
    private _co2;
    private _n2;
    constructor(spgr?: number, h2s?: number, co2?: number, n2?: number);
    set spgr(val: number);
    get spgr(): number;
    set h2s(val: number);
    get h2s(): number;
    set co2(val: number);
    get co2(): number;
    set n2(val: number);
    get n2(): number;
}
declare class GasProperties {
    private _pressure;
    private _temperature;
    private _zfactor;
    private _gasFormationVolumeFactor;
    private _gasViscosity;
    private _gasDensity;
    set pressure(value: number);
    set temperature(value: number);
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
    calculateZFactor(spgr: number, h2sPercentage: number, co2Percentage: number, pressure: number, temperature: number): number;
    /**
     * Calculates the gas density (in lb/ft3).
     * @param spgr Gas specific gravity
     * @param pressure Pressure in psia
     * @param temperature Temperature in Fahrenheit
     * @param zfactor Gas Z-factor
     * @returns Density in lb/ft^3
     */
    calculateGasDensity(spgr: number, pressure: number, temperature: number, zfactor: number): number;
    /**
     * Calculates the Gas Formation Volume Factor (Bg) in ft3/scf.
     * Standard conditions assumed as 14.7 psia and 60 deg F.
     * @param pressure Pressure in psia
     * @param temperature Temperature in Fahrenheit
     * @param zfactor Gas Z-factor
     * @returns Bg in ft3/scf
     */
    calculateGasFormationVolumeFactor(pressure: number, temperature: number, zfactor: number): number;
    /**
     * Calculates gas viscosity using Lee, Gonzalez, and Eakin (1966) method.
     * @param spgr Gas specific gravity
     * @param pressure Pressure in psia
     * @param temperature Temperature in Fahrenheit
     * @param zfactor Gas Z-factor
     * @returns Viscosity in centipoise (cp)
     */
    calculateGasViscosity(spgr: number, pressure: number, temperature: number, zfactor: number): number;
}
export { Gas, GasProperties };
//# sourceMappingURL=Gas.d.ts.map