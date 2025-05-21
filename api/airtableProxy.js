export default async function handler(req, res) {
  const token = process.env.DONOR_TOKEN;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  try {
    // GET request - fetch all records
    if (req.method === 'GET') {
      const { baseId } = req.query;
      const response = await fetch(`https://api.airtable.com/v0/${baseId}/Donors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    
    // POST request - batch update
    if (req.method === 'POST') {
      const { baseId, updates } = req.body;
      
      // Process updates in batches of 10 (Airtable limit)
      for (let i = 0; i < updates.length; i += 10) {
        const batch = updates.slice(i, i + 10);
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/Donors`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: batch.map(update => ({
              id: update.id,
              fields: update.fields
            }))
          })
        });
        
        if (!response.ok) throw new Error(`Batch ${i} failed`);
      }
      
      return res.status(200).json({ success: true });
    }
    
    throw new Error('Method not allowed');
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
