import {
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {/* inject, */ BindingScope, injectable, Provider} from '@loopback/core';
import {MessageData} from '../types';

export const client = new SQSClient({region: 'us-east-1'});

@injectable({scope: BindingScope.TRANSIENT})
export class SendMessageProvider
  implements Provider<(data: MessageData[], level: number) => Promise<void>>
{
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    return this.sendMessage;
  }
  async sendMessage(data: MessageData[], level: number) {
    let group = 1;
    // divide messages : max 10 messages can be sent at once in sqs via SendMessageBatchCommand
    for (let i = 0; i < data.length; i += 10) {
      const messageGroup = data.slice(i, i + 10);

      const params: {
        QueueUrl: string;
        Entries: SendMessageBatchRequestEntry[];
      } = {
        QueueUrl: getQueueURL(level) as string,
        Entries: [],
      };

      messageGroup.forEach((message, index) => {
        // MAKE PARAMS CONFIGURABLE
        params.Entries.push({
          MessageAttributes: {
            Title: {
              DataType: 'String',
              StringValue: 'Import from Excel Data',
            },
            Author: {
              DataType: 'String',
              StringValue: 'Barleen',
            },
          },
          MessageBody: JSON.stringify(message),
          Id: `group_${group}_message_${index + 1}`,
        });
      });
      await client.send(new SendMessageBatchCommand(params));
      group++;
    }
  }
}
export function getQueueURL(level: number) {
  // max 8 levels permitted in excel. take queue urls from user
  switch (level) {
    case 0:
      return 'https://sqs.us-east-1.amazonaws.com/341707006720/import-level0';

    case 1:
      return 'https://sqs.us-east-1.amazonaws.com/341707006720/import-level1';

    case 2:
      return 'https://sqs.us-east-1.amazonaws.com/341707006720/import-level2';

    case 3:
      return 'https://sqs.us-east-1.amazonaws.com/341707006720/import-level3';

    case 4:
      return 'https://sqs.us-east-1.amazonaws.com/341707006720/import-level4';
  }
}
