#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ExampleAppStack } from '../lib/example-app-stack';

const app = new cdk.App();
new ExampleAppStack(app, 'ExampleAppStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
