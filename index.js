"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Gas_1 = require("./Gas");
const app = (0, express_1.default)();
const port = 3000;
// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get('/', (req, res) => {
    res.render('form');
});
app.post('/calculate', (req, res) => {
    const { spgr, h2s, co2, n2, pressure, temperature } = req.body;
    // Parse inputs
    const spgrNum = parseFloat(spgr);
    const h2sNum = parseFloat(h2s);
    const co2Num = parseFloat(co2);
    const n2Num = parseFloat(n2);
    const pressureNum = parseFloat(pressure);
    const temperatureNum = parseFloat(temperature);
    // Create Gas instance
    const gas = new Gas_1.Gas(spgrNum, h2sNum, co2Num, n2Num);
    // Create GasProperties and calculate
    const gp = new Gas_1.GasProperties();
    const z = gp.calculateZFactor(gas.spgr, gas.h2s, gas.co2, pressureNum, temperatureNum);
    const fvf = gp.calculateGasFormationVolumeFactor(pressureNum, temperatureNum, z);
    const density = gp.calculateGasDensity(gas.spgr, pressureNum, temperatureNum, z);
    const viscosity = gp.calculateGasViscosity(gas.spgr, pressureNum, temperatureNum, z);
    // Render results
    res.render('results', {
        spgr: spgrNum,
        h2s: h2sNum,
        co2: co2Num,
        n2: n2Num,
        pressure: pressureNum,
        temperature: temperatureNum,
        z,
        fvf,
        density,
        viscosity
    });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map