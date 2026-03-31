"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gas = void 0;
class Gas {
    constructor(spgr, h2s, co2, n2) {
        this._spgr = (spgr == null) ? 0.65 : spgr;
        this._h2s = (h2s == null) ? 0.0 : h2s;
        this._co2 = (co2 == null) ? 0.0 : co2;
        this._n2 = (n2 == null) ? 0.0 : n2;
    }
    set spgr(val) {
        this._spgr = val;
    }
    get spgr() {
        return this._spgr;
    }
}
exports.Gas = Gas;
class GasProperties {
    constructor() {
        this._pressure = 0.0;
        this._temperature = 0.0;
        this._zfactor = 0.0;
        this._gasFormationVolumeFactor = 0.0;
        this._gasViscosity = 0.0;
        this._gasDensity = 0.0;
    }
    set pressure(value) {
        this._pressure = value;
    }
    set temperature(value) {
        this._temperature = value;
    }
    set zfactor(value) {
        this._zfactor = value;
    }
}
//# sourceMappingURL=Gas.js.map