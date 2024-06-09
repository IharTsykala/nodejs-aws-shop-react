import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName = `shop-react-bucket-${Date.now()}`;

    const ShopReactBucket: s3.Bucket = new s3.Bucket(this, 'ShopReactBucket', {
      bucketName,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD
          ],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
          maxAge: 3000,
        },
      ],
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'WebsiteDistributionShopReact', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: ShopReactBucket,
            originAccessIdentity: originAccessIdentity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              forwardedValues: {
                headers: ['Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
                queryString: true,
              },
            },
          ],
        },
      ],
    });

    ShopReactBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${ShopReactBucket.bucketArn}/*`],
      principals: [new iam.CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    const deploymentRole = new iam.Role(this, 'DeploymentRoleShopReact', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    deploymentRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        's3:Abort*',
        's3:DeleteObject*',
        's3:GetBucket*',
        's3:GetObject*',
        's3:List*',
        's3:PutObject*',
        'cloudfront:CreateInvalidation',
        'cloudfront:GetInvalidation'
      ],
      resources: [
        ShopReactBucket.bucketArn,
        `${ShopReactBucket.bucketArn}/*`,
        '*'
      ],
    }));

    new s3deploy.BucketDeployment(this, 'DeployShopReact', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../dist'))],
      destinationBucket: ShopReactBucket,
      distribution,
      distributionPaths: ['/*'],
      role: deploymentRole,
      retainOnDelete: false,
    });

    new cdk.CfnOutput(this, 'CloudFrontShopReact', {
      value: distribution.distributionDomainName,
      description: 'The CloudFront distribution ShopReact',
    });

    new cdk.CfnOutput(this, 'S3WebsiteURL', {
      value: ShopReactBucket.bucketWebsiteUrl,
      description: 'The URL of the S3 bucket static website',
    });
  }
}
