import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();

// ---- CONFIG ----
const REGION = process.env.AWS_REGION || "ap-south-1";
// const BUCKET = process.env.S3_BUCKET;
const BUCKET = "clusterdev3";

const s3 = new S3Client({ region: REGION });

// ---- FILE ROUTE (NO path-to-regexp issues) ----
app.use("/files", async (req, res) => {
  try {
    // removes leading "/"
    const key = `files/${req.path.slice(1)}`;

    if (!key) {
      return res.status(400).json({ error: "Missing file path" });
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 300, // 5 min
    });
    console.log("Fetching key:", key);
    return res.json({ url });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Failed to generate URL" });
  }
});

// ---- HEALTH ----
app.get("/health", (_, res) => {
  res.send("OK");
});

// ---- START ----
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});