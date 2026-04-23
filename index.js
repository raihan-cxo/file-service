import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();
const s3 = new S3Client({ region: "ap-south-1" });

app.get("/files/*", async (req, res) => {
  try {
    const key = req.path.replace("/files/", "");

    const command = new GetObjectCommand({
      Bucket: "clusterdev3",
      Key: `files/${key}`,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 60, // seconds
    });

    return res.redirect(302, url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error generating file URL");
  }
});

app.listen(3000, () => console.log("File service running"));