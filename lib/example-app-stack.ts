import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as ecrdeploy from 'cdk-ecr-deployment';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class ExampleAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'ExampleBucket', {});
    const bucket2 = new s3.Bucket(this, 'ExampleBucket2', {});

    const repository = new ecr.Repository(this, 'ExampleRepository', {});

    const asset = new DockerImageAsset(this, 'ExampleBuildImage', {
      directory: path.join(__dirname, 'example-image'),
    });

    
    new ecrdeploy.ECRDeployment(this, 'ExampleDeploy1', {
      src: new ecrdeploy.DockerImageName(asset.imageUri),
      dest: new ecrdeploy.DockerImageName(`111279636657.dkr.ecr.us-east-1.amazonaws.com/deployment-test`),
    });
    
    
    const table = new dynamodb.Table(this, 'ExampleTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });
    
  }
}
