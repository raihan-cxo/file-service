import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();

// ---- CONFIG ----
const REGION = process.env.AWS_REGION;
const BUCKET = process.env.S3_BUCKET;

// IAM role preferred (no hardcoded keys)
const s3 = new S3Client({ region: REGION });

// ---- ROUTE ----
// Example: /files/my/folder/file.jpg
app.get("/files/*", async (req, res) => {
  try {
    const key = req.params[0]; // wildcard capture

    if (!key) {
      return res.status(400).json({ error: "Missing file path" });
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    // expires in 5 minutes
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return res.json({ url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate URL" });
  }
});

// ---- HEALTH ----
app.get("/health", (_, res) => res.send("OK"));

app.listen(3000, () => {
  console.log("File service running on port 3000");
});