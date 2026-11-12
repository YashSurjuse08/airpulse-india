import {createContext,useContext,useEffect,useState,useCallback} from 'react';
import {CITIES} from './cities';import {naqi} from './aqi';
const Ctx=createContext();export const useApp=()=>useContext(Ctx);
const q=k=>CITIES.map(c=>c[k]).join(',');
const J=p=>p.then(r=>{if(!r.ok)throw new Error('Data service returned HTTP '+r.status);return r.json()});
export function Provider({children}){
 const [s,setS]=useState({status:'loading',cities:[]});const [sel,setSel]=useState('Delhi');
 const [dark,setDark]=useState(()=>localStorage.getItem('t')==='d');
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark);localStorage.setItem('t',dark?'d':'l')},[dark]);
 const load=useCallback(async()=>{setS(x=>({...x,status:'loading'}));try{
  const b=`latitude=${q('lat')}&longitude=${q('lon')}&timezone=Asia%2FKolkata`;
  const [a,w]=await Promise.all([J(fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${b}&current=pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,ozone&hourly=pm2_5,pm10&past_days=30&forecast_days=1`)),J(fetch(`https://api.open-meteo.com/v1/forecast?${b}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`))]);
  const cities=CITIES.map((c,i)=>{const cur=a[i].current,h=a[i].hourly;
   const series=h.time.map((t,j)=>({t,pm25:h.pm2_5[j],pm10:h.pm10[j],aqi:naqi(h.pm2_5[j],h.pm10[j])})).filter(x=>x.t<=cur.time);
   const now=naqi(cur.pm2_5,cur.pm10);const pv=series.slice(-48,-24).map(x=>x.aqi).filter(x=>x!=null);
   const avg=pv.length?pv.reduce((u,v)=>u+v,0)/pv.length:null;
   return{...c,aqi:now,time:cur.time,series,trend:now!=null&&avg!=null?Math.round(now-avg):null,
    p:{pm25:cur.pm2_5,pm10:cur.pm10,no2:cur.nitrogen_dioxide,so2:cur.sulphur_dioxide,co:cur.carbon_monoxide,o3:cur.ozone},
    wx:{temp:w[i].current.temperature_2m,hum:w[i].current.relative_humidity_2m,wind:w[i].current.wind_speed_10m}}});
  setS({status:'ok',cities,updated:cities[0].time});
 }catch(e){setS({status:'error',cities:[],error:e.message})}},[]);
 useEffect(()=>{load()},[load]);
 return <Ctx.Provider value={{...s,sel,setSel,dark,setDark,reload:load}}>{children}</Ctx.Provider>}
