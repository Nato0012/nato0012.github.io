export default async function handler(req, res) {
  const token = process.env.DONOR_TOKEN;
  const baseId = process.env.DONOR_ID;
  const tableId = process.env.DONOR_TABLE;
  const viewId = process.env.DONOR_VIEW;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  try {
    // Verify configuration
    const missing = [];
    if (!token) missing.push("DONOR_TOKEN");
    if (!baseId) missing.push("DONOR_ID");
    if (!tableId) missing.push("DONOR_TABLE");
    if (missing.length) {
      throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }

    // GET request - fetch records
    if (req.method === 'GET') {
      const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
      if (viewId) url.searchParams.append('view', viewId);
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Airtable API Error:", {
          status: response.status,
          error: error
        });
        throw new Error(error.error?.message || `Airtable error: ${response.status}`);
      }

      const data = await response.json();
      return res.status(200).json({
        success: true,
        records: data.records || []
      });
    }

    // POST request - update records
    if (req.method === 'POST') {
      const { updates } = req.body;
      const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: updates.map(update => ({
            id: update.id,
            fields: update.fields
          }))
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Update failed: ${response.status}`);
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    throw new Error('Method not allowed');
  } catch (error) {
    console.error("Proxy Error:", error.message);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      details: {
        baseId,
        tableId,
        viewId,
        hasToken: !!token
      }
    });
  }
}
