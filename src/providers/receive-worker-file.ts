import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchRequestEntry,
  GetQueueAttributesCommand,
  ReceiveMessageCommand,
} from '@aws-sdk/client-sqs';
import {v4 as uuidv4} from 'uuid';
import {parentPort} from 'worker_threads';
import {batchSize} from '../services';
import {client, dataQueueUrl} from './send-message.provider';

// const fileCount = new Map<string, number>();
const maxCount = 10; // MAKE CONFIGURABLE
let remainingMessages = Infinity;

async function receive() {
  /*
  MaxNumberOfMessages maximum value = 10
  WaitTimeSeconds maximum value = 20
  taken max values to reduce number of calls
  */

  // let numberOfMessagesRemaining = Infinity; // number of messages available in queue

  const params = {
    AttributeNames: [],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ['All'],
    QueueUrl: dataQueueUrl,
    WaitTimeSeconds: 20,
  };
  const data = await client.send(new ReceiveMessageCommand(params));
  if (data.Messages) {
    const fileId = data.Messages[0].MessageAttributes?.FileId
      .StringValue as string;
    const totalRows = parseInt(
      data.Messages[0].MessageAttributes?.Count.StringValue as string,
    );

    const queueInfo = await client.send(
      new GetQueueAttributesCommand({
        QueueUrl: dataQueueUrl,
        AttributeNames: ['ApproximateNumberOfMessages'],
      }),
    );
    remainingMessages = parseInt(
      queueInfo.Attributes?.ApproximateNumberOfMessages as string,
    );

    data.Messages.forEach(message => {
      const data: {rows: any[]; types: Record<string, string>[]} = JSON.parse(
        message.Body as string,
      );
      parentPort?.postMessage({data, fileId, totalRows});
    });
    //delete from queue
    const deleteCommandReceiptHandle: DeleteMessageBatchRequestEntry[] = [];
    data.Messages?.forEach(message => {
      const id = uuidv4();
      deleteCommandReceiptHandle.push({
        Id: `${id}`,
        ReceiptHandle: message.ReceiptHandle,
      });
    });
    client.send(
      new DeleteMessageBatchCommand({
        Entries: deleteCommandReceiptHandle,
        QueueUrl: dataQueueUrl,
      }),
    );
  }
}

function receiveInvoker() {
  let count = 0;
  setInterval(() => {
    if (
      count < maxCount &&
      count < Math.ceil(remainingMessages / batchSize) + 1
    ) {
      count++;
      receive().then(() => {
        count--;
      });
    }
  }, 0);
}
receiveInvoker();
