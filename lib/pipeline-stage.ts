import { ExampleAppStack } from './example-app-stack';
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ExamplePipelineStack } from './pipeline-stack';

export class ExamplePipelineStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new ExampleAppStack(this, 'ExampleAppStack-deployed');
    }
}