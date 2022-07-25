import { Construct } from "constructs";
import * as cdktf from "cdktf";
import * as aws from "@cdktf/provider-aws";

class MyStack extends cdktf.TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    

    new aws.AwsProvider(this, "AWS", {
      region: "us-west-1",
    });

    // const instance = new aws.ec2.Instance(this, "compute", {
    //   instanceType: "t2.micro",
    // });

    // new cdktf.TerraformOutput(this, "public_ip", {
    //   value: instance.publicIp,
    // });

    new aws.amplify.AmplifyApp(this, 'nextjs-app', {  });

  }
}

const app = new cdktf.App();
new MyStack(app, "aws_instance");

// new RemoteBackend(stack, {
//   hostname: "app.terraform.io",
//   organization: "<YOUR_ORG>",
//   workspaces: {
//     name: "learn-cdktf",
//   },
// });

app.synth();