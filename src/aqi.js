// Indian NAQI (CPCB) sub-index from PM2.5 and PM10 only. Other pollutants are shown as raw concentrations.
const BP={pm25:[[0,30,0,50],[30,60,51,100],[60,90,101,200],[90,120,201,300],[120,250,301,400],[250,500,401,500]],
pm10:[[0,50,0,50],[50,100,51,100],[100,250,101,200],[250,350,201,300],[350,430,301,400],[430,600,401,500]]};
const sub=(v,k)=>{if(v==null)return null;for(const[l,h,a,b]of BP[k])if(v<=h)return Math.round(a+(v-l)*(b-a)/(h-l));return 500};
export const naqi=(a,b)=>{const s=[sub(a,'pm25'),sub(b,'pm10')].filter(x=>x!=null);return s.length?Math.max(...s):null};
export const CATS=[
{max:50,name:'Good',color:'#16a34a',score:100,gen:'Air quality is good. Enjoy normal outdoor activities.',sens:'No special precautions needed.',ex:'Ideal for outdoor exercise.',mask:'Not needed.'},
{max:100,name:'Satisfactory',color:'#84cc16',score:85,gen:'Acceptable air. Minor discomfort possible for a few very sensitive people.',sens:'Unusually sensitive people may notice minor breathing discomfort.',ex:'Outdoor exercise is fine.',mask:'Not needed.'},
{max:200,name:'Moderate',color:'#eab308',score:60,gen:'Breathing discomfort possible for people with lung or heart disease, children and older adults.',sens:'Children, elderly and respiratory-sensitive people should limit prolonged outdoor exertion.',ex:'Reduce long, intense outdoor workouts.',mask:'Optional for sensitive groups (N95/FFP2).'},
{max:300,name:'Poor',color:'#f97316',score:35,gen:'Prolonged exposure may cause breathing discomfort for most people.',sens:'Sensitive groups should stay indoors and keep rescue medication handy.',ex:'Move workouts indoors.',mask:'N95/FFP2 recommended outdoors.'},
{max:400,name:'Very Poor',color:'#dc2626',score:15,gen:'Prolonged exposure may cause respiratory illness. Avoid outdoor exertion.',sens:'Stay indoors; consult a doctor if symptoms such as persistent cough or breathlessness occur.',ex:'Avoid outdoor exercise.',mask:'N95/FFP2 strongly recommended outdoors.'},
{max:Infinity,name:'Severe',color:'#7f1d1d',score:5,gen:'Serious health impact even on healthy people. Stay indoors.',sens:'High risk: avoid all outdoor activity and seek medical advice for symptoms.',ex:'No outdoor exercise.',mask:'N95/FFP2 essential if you must go out.'}];
export const catOf=a=>a==null?{name:'No data',color:'#94a3b8',score:0,gen:'Not enough data.',sens:'—',ex:'—',mask:'—'}:CATS.find(c=>a<=c.max);
export const POLS=[['pm25','PM2.5',60],['pm10','PM10',100],['no2','NO₂',80],['so2','SO₂',80],['co','CO',2000],['o3','O₃',100]]; // 24h CPCB standards, µg/m³ (CO: 8h)
export const fmt=v=>v==null?'—':Math.round(v*10)/10;
