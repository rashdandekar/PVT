import { Gas, GasProperties } from "./Gas"



let g = new Gas(0.7);
g.spgr = 0.66;
g.co2 = 0.23;
g.h2s = 0.0;
g.n2 = 0.01;
let gp = new GasProperties();
let z = gp.calculateZFactor(g.spgr, g.h2s, g.co2, 4900, 374);
let fvf = gp.calculateGasFormationVolumeFactor(4900, 374, z);
let density = gp.calculateGasDensity(g.spgr, 4900, 374, z);
let viscosity = gp.calculateGasViscosity(g.spgr, 4900, 374, z);
console.log(z);
console.log(fvf);
console.log(density);
console.log(viscosity);
