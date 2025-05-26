export default async function handler(req, res) {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  
  res.json({
    donorToken: process.env.DONOR_TOKEN,
    donorId: process.env.DONOR_ID,
    donorTable: process.env.DONOR_TABLE,
    donorView: process.env.DONOR_VIEW,
    blocsBin: process.env.BLOCS_BIN  // Not used for Airtable
  });
}
