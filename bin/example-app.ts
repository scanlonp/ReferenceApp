#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ExamplePipelineStack } from '../lib/pipeline-stack';
import { ExampleAppStack } from '../lib/example-app-stack';

const app = new cdk.App();
new ExamplePipelineStack(app, 'MyExamplePipelineStack');
