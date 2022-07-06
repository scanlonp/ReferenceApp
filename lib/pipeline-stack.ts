import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { CodeBuildStep, CodePipelineSource, CodePipeline } from 'aws-cdk-lib/pipelines';
import { ExamplePipelineStage } from './pipeline-stage';
import { Construct } from 'constructs';
import { CodeStarConnectionsSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';

export class ExamplePipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Creates a CodeCommit repository called 'ExampleRepo'
        //const repo = codecommit.Repository.fromRepositoryName(this, 'ExampleRepo', 'ExampleRepo');
        
        const repo = cdk.aws_ecr.Repository.fromRepositoryName(this, 'RunningRepo', 'deployment-test');

        // Pipeline code goes here
        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'ExamplePipeline',
            synth: new CodeBuildStep('SynthStep', {
                input: CodePipelineSource.connection('scanlonp/ReferenceApp', 'master', {
                    connectionArn: 'arn:aws:codestar-connections:us-east-1:111279636657:connection/ee55ed61-4892-4008-a32b-a7c549c27ca8',
                }),
                //input: CodePipelineSource.gitHub('scanlonp/ReferenceApp', 'master'),
                //input: CodePipelineSource.codeCommit(repo, 'master'),
                installCommands: [
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ], 
            }),
            
            
            // to try to build the ecr deploy lambda at synth time
            dockerEnabledForSynth: true,
            dockerEnabledForSelfMutation: true,

        });

        const deploy = new ExamplePipelineStage(this, 'Deploy');
        const deployStage = pipeline.addStage(deploy);

        pipeline.addWave('MyWave', {
            post: [
              new CodeBuildStep('Docker Run', {
                commands: ['command-from-image'],
                buildEnvironment: {
                  buildImage: cdk.aws_codebuild.LinuxBuildImage.fromEcrRepository(repo, 'latest'), 
                },
              }),
            ],
          });
    }
}