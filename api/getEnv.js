export default function handler(req, res) {
  res.json({
    jsonBinKey: process.env.JSONBIN_KEY,
    donorId: process.env.DONOR_ID,
    blocsBin: process.env.BLOCS_BIN
  });
}
