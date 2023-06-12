"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITStaticSite = void 0;
const cdk = require("aws-cdk-lib");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cdkCore = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class ITStaticSite extends core_1.Construct {
    constructor(parent, name) {
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
        siteBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ["S3:GetObject"],
            resources: [siteBucket.arnForObjects("*")],
            principals: [
                new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId),
            ],
        }));
        const distribution = new cloudfront.CloudFrontWebDistribution(this, "IT-distribution", {
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
        });
        new s3deploy.BucketDeployment(this, "IT-Bucket-Deployment", {
            sources: [s3deploy.Source.asset("./dist")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"],
        });
    }
}
exports.ITStaticSite = ITStaticSite;
class MyStaticSiteStack extends core_1.Stack {
    constructor(parent, name) {
        super(parent, name);
        new ITStaticSite(this, "ITStaticSite");
    }
}
const app = new cdkCore.App();
new MyStaticSiteStack(app, "MyITStaticSite");
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMsc0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMsdURBQXVEO0FBQ3ZELHlDQUF5QztBQUV6Qyx3Q0FBaUQ7QUFFakQsbUNBQWdDO0FBQ2hDLElBQUEsZUFBTSxHQUFFLENBQUM7QUFFVCxNQUFhLFlBQWEsU0FBUSxnQkFBUztJQUN6QyxZQUFZLE1BQWEsRUFBRSxJQUFZO1FBQ3JDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFcEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTFFLE1BQU0sVUFBVSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDaEUsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztZQUNqRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ3pDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxtQkFBbUIsQ0FDNUIsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUN6QixTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLFVBQVUsRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsQ0FDNUIsYUFBYSxDQUFDLCtDQUErQyxDQUM5RDthQUNGO1NBQ0YsQ0FBQyxDQUNILENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FDM0QsSUFBSSxFQUNKLGlCQUFpQixFQUNqQjtZQUNFLGFBQWEsRUFBRTtnQkFDYjtvQkFDRSxjQUFjLEVBQUU7d0JBQ2QsY0FBYyxFQUFFLFVBQVU7d0JBQzFCLG9CQUFvQixFQUFFLGFBQWE7cUJBQ3BDO29CQUNELFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxpQkFBaUIsRUFBRSxJQUFJO3lCQUN4QjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FDRixDQUFDO1FBRUYsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQzFELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFDLGlCQUFpQixFQUFFLFVBQVU7WUFDN0IsWUFBWTtZQUNaLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXRERCxvQ0FzREM7QUFFRCxNQUFNLGlCQUFrQixTQUFRLFlBQUs7SUFDbkMsWUFBWSxNQUFtQixFQUFFLElBQVk7UUFDM0MsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQixJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNGO0FBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFOUIsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUU3QyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5cbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSBcIkBhd3MtY2RrL2F3cy1jbG91ZGZyb250XCI7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSBcIkBhd3MtY2RrL2F3cy1pYW1cIjtcbmltcG9ydCAqIGFzIHMzIGZyb20gXCJAYXdzLWNkay9hd3MtczNcIjtcbmltcG9ydCAqIGFzIHMzZGVwbG95IGZyb20gXCJAYXdzLWNkay9hd3MtczMtZGVwbG95bWVudFwiO1xuaW1wb3J0ICogYXMgY2RrQ29yZSBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuXG5pbXBvcnQgeyBDb25zdHJ1Y3QsIFN0YWNrIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcblxuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSBcImRvdGVudlwiO1xuY29uZmlnKCk7XG5cbmV4cG9ydCBjbGFzcyBJVFN0YXRpY1NpdGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IFN0YWNrLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcihwYXJlbnQsIG5hbWUpO1xuXG4gICAgY29uc3QgY2xvdWRmcm9udE9BSSA9IG5ldyBjbG91ZGZyb250Lk9yaWdpbkFjY2Vzc0lkZW50aXR5KHRoaXMsIFwiSVQtT0FJXCIpO1xuXG4gICAgY29uc3Qgc2l0ZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgXCJJaGFyVHN5a2FsYVN0YXRpY0J1Y2tldFwiLCB7XG4gICAgICBidWNrZXROYW1lOiBcInRhc2stNC1jbG91ZGZyb250XCIsXG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogXCJpbmRleC5odG1sXCIsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBzaXRlQnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFtcIlMzOkdldE9iamVjdFwiXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbc2l0ZUJ1Y2tldC5hcm5Gb3JPYmplY3RzKFwiKlwiKV0sXG4gICAgICAgIHByaW5jaXBhbHM6IFtcbiAgICAgICAgICBuZXcgaWFtLkNhbm9uaWNhbFVzZXJQcmluY2lwYWwoXG4gICAgICAgICAgICBjbG91ZGZyb250T0FJLmNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eVMzQ2Fub25pY2FsVXNlcklkXG4gICAgICAgICAgKSxcbiAgICAgICAgXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJJVC1kaXN0cmlidXRpb25cIixcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICAgIHMzQnVja2V0U291cmNlOiBzaXRlQnVja2V0LFxuICAgICAgICAgICAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eTogY2xvdWRmcm9udE9BSSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCBcIklULUJ1Y2tldC1EZXBsb3ltZW50XCIsIHtcbiAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQoXCIuL2Rpc3RcIildLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXG4gICAgICBkaXN0cmlidXRpb24sXG4gICAgICBkaXN0cmlidXRpb25QYXRoczogW1wiLypcIl0sXG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgTXlTdGF0aWNTaXRlU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrQ29yZS5BcHAsIG5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKHBhcmVudCwgbmFtZSk7XG4gICAgbmV3IElUU3RhdGljU2l0ZSh0aGlzLCBcIklUU3RhdGljU2l0ZVwiKTtcbiAgfVxufVxuY29uc3QgYXBwID0gbmV3IGNka0NvcmUuQXBwKCk7XG5cbm5ldyBNeVN0YXRpY1NpdGVTdGFjayhhcHAsIFwiTXlJVFN0YXRpY1NpdGVcIik7XG5cbmFwcC5zeW50aCgpO1xuIl19