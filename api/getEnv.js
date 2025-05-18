export default async function handler(req, res) {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  
  res.json({
    jsonBinKey: process.env.JSONBIN_KEY,
    donorId: process.env.DONOR_ID,
    blocsBin: process.env.BLOCS_BIN
  });
}
