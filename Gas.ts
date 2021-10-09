class Gas{
// inputs
  private _spgr:number;
  private _h2s:number;
  private _co2:number;
  private _n2:number;

  constructor(spgr?:number, h2s?:number, co2?:number, n2?:number){
    this._spgr = (spgr==null) ? 0.65 : spgr;
    this._h2s = (h2s==null) ? 0.0 : h2s;
    this._co2 = (co2==null) ? 0.0 : co2;
    this._n2 = (n2 == null) ? 0.0 : n2;
  }

  set spgr(val:number){
    this._spgr=val;
  }

  get spgr():number{
    return this._spgr;
  }


}


class GasProperties{
  private _pressure:number=0.0;
  private _temperature:number=0.0;
  private _zfactor:number=0.0;
  private _gasFormationVolumeFactor:number=0.0;
  private _gasViscosity:number=0.0;
  private _gasDensity:number=0.0;

  set pressure(value:number){
    this._pressure=value;
  }
  set temperature(value:number){
    this._temperature=value;
  }
  
  set zfactor(value:number){
    this._zfactor=value;
  }
}
export { Gas };