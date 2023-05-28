import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  aws_cloudfront,
  aws_iam,
  aws_s3,
  aws_s3_deployment,
} from "aws-cdk-lib";

import { config } from "dotenv";
config();

export class ITStaticSite extends Construct {
  constructor(parent: Construct, name: string) {
    super(parent, name);

    const cloudfrontOAI = new aws_cloudfront.OriginAccessIdentity(
      this,
      "IT-OAI"
    );

    const siteBucket = new aws_s3.Bucket(this, "IharTsykalaStaticBucket", {
      bucketName: "task-2-cloudfront-s3-0.0.3",
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      autoDeleteObjects: true,
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    siteBucket.addToResourcePolicy(
      new aws_iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new aws_iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new aws_cloudfront.CloudFrontWebDistribution(
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

    new aws_s3_deployment.BucketDeployment(this, "IT-Bucket-Deployment", {
      sources: [aws_s3_deployment.Source.asset("./dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
