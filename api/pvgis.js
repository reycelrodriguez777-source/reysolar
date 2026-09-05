module.exports = async function handler(req, res) {
  try {
    const { lat, lon, angle = '0', aspect = '0' } = req.query || {};
    const latN=Number(lat), lonN=Number(lon), angleN=Number(angle), aspectN=Number(aspect);
    if(!Number.isFinite(latN)||latN<-90||latN>90||!Number.isFinite(lonN)||lonN<-180||lonN>180) return res.status(400).json({error:'Coordenadas inválidas.'});
    if(!Number.isFinite(angleN)||angleN<0||angleN>90||!Number.isFinite(aspectN)||aspectN<-180||aspectN>180) return res.status(400).json({error:'Parámetros de inclinación/orientación inválidos.'});
    const params=new URLSearchParams({lat:String(latN),lon:String(lonN),month:'0',selectrad:'1',angle:String(angleN),aspect:String(aspectN),outputformat:'json'});
    const response=await fetch(`https://re.jrc.ec.europa.eu/api/v5_3/MRcalc?${params.toString()}`,{headers:{Accept:'application/json'}});
    const text=await response.text(); let data; try{data=JSON.parse(text)}catch{data={error:text||'Respuesta no válida de PVGIS.'}}
    if(!response.ok)return res.status(response.status).json({error:data.error||data.message||`PVGIS HTTP ${response.status}`});
    return res.status(200).json(data);
  } catch(err){ return res.status(502).json({error:`No se pudo consultar PVGIS: ${err.message}`}); }
}

