import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { CodeBuildStep, CodePipelineSource, CodePipeline } from 'aws-cdk-lib/pipelines';
import { ExamplePipelineStage } from './pipeline-stage';
import { Construct } from 'constructs';

export class ExamplePipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Creates a CodeCommit repository called 'ExampleRepo'
        const repo = codecommit.Repository.fromRepositoryName(this, 'ExampleRepo', 'ExampleRepo');
        
        // Pipeline code goes here
        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'ExamplePipeline',
            synth: new CodeBuildStep('SynthStep', {
                input: CodePipelineSource.gitHub('scanlonp/ReferenceApp', 'master'),
                //input: CodePipelineSource.codeCommit(repo, 'master'),
                installCommands: [
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'npm ci',
                    'npm run build',
                    ' npx cdk synth'
                ],
            }),
            
            // to try to build the ecr deploy lambda at synth time
            dockerEnabledForSynth: true,

        });

        const deploy = new ExamplePipelineStage(this, 'Deploy');
        const deployStage = pipeline.addStage(deploy);
    }
}