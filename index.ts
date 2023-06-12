import * as cdk from "aws-cdk-lib";

import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cdkCore from "@aws-cdk/core";

import { Construct, Stack } from "@aws-cdk/core";

import { config } from "dotenv";
config();

export class ITStaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "IT-OAI");

    const siteBucket = new s3.Bucket(this, "IharTsykalaStaticBucket", {
      bucketName: "task-4-cloudfront",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "IT-distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudfrontOAI,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "IT-Bucket-Deployment", {
      sources: [s3deploy.Source.asset("./dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}

class MyStaticSiteStack extends Stack {
  constructor(parent: cdkCore.App, name: string) {
    super(parent, name);
    new ITStaticSite(this, "ITStaticSite");
  }
}
const app = new cdkCore.App();

new MyStaticSiteStack(app, "MyITStaticSite");

app.synth();
