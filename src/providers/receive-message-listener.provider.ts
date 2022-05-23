import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchRequestEntry,
  ReceiveMessageCommand,
} from '@aws-sdk/client-sqs';
import {/* inject, */ BindingScope, injectable, Provider} from '@loopback/core';
import {client, getQueueURL} from './send-message.provider';

// const queueUrl =
//   'https://sqs.us-east-1.amazonaws.com/341707006720/import-excel-barleen.fifo';

@injectable({scope: BindingScope.TRANSIENT})
export class ReceiveMessageListenerProvider implements Provider<() => void> {
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    return receiveMessageListener;
  }
}

async function receiveMessageListener() {
  // take max outline level as input from user
  for (let i = 0; i <= 4; i++) {
    await receive(i, new Date());
  }
}
async function receive(level: number, startTime: Date, group: number = 1) {
  //MaxNumberOfMessages maximum value = 10
  //WaitTimeSeconds maximum value = 20
  const params = {
    AttributeNames: ['SentTimestamp'],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ['All'],
    QueueUrl: getQueueURL(level),
    WaitTimeSeconds: 20,
  };

  const data = await client.send(new ReceiveMessageCommand(params));

  const timeDiffInSeconds = (new Date().valueOf() - startTime.valueOf()) / 1000;
  // take max time difference from user
  if (timeDiffInSeconds > 30 && !data.Messages) {
    return;
  }

  if (data.Messages) {
    data.Messages.forEach(message => {
      const res: {rows: any[]; types: Record<string, string>[]} = JSON.parse(
        message.Body as string,
      );
      console.log(res);

      // invoke save to db provider
    });

    //delete from queue
    const deleteCommandReceiptHandle: DeleteMessageBatchRequestEntry[] = [];
    data.Messages?.forEach((message, index) =>
      deleteCommandReceiptHandle.push({
        Id: `${group}_${index}`,
        ReceiptHandle: message.ReceiptHandle,
      }),
    );

    await client.send(
      new DeleteMessageBatchCommand({
        Entries: deleteCommandReceiptHandle,
        QueueUrl: getQueueURL(level),
      }),
    );
  }

  await receive(level, startTime, group++);
}
