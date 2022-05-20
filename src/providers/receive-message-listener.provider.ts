import {/* inject, */ BindingScope, injectable, Provider} from '@loopback/core';

const queueUrl =
  'https://sqs.us-east-1.amazonaws.com/341707006720/import-excel-barleen.fifo';

@injectable({scope: BindingScope.TRANSIENT})
export class ReceiveMessageListenerProvider implements Provider<() => void> {
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    return receiveMessageListener;
  }
}

function receiveMessageListener() {
  const params = {
    AttributeNames: ['SentTimestamp'],
    MaxNumberOfMessages: 5,
    MessageAttributeNames: ['All'],
    QueueUrl: queueUrl,
    WaitTimeSeconds: 20,
  };
  // sqs.receiveMessage(params, (err: AWSError, data: ReceiveMessageResult) => {
  //   if (err) {
  //     console.log('Receive Error', err);
  //   } else if (data.Messages) {
  //     console.log(`recevied message ${index++}`);
  //     data.Messages.forEach(message => {
  //       const res: {rows: any[]; types: any[]} = JSON.parse(
  //         message.Body as string,
  //       );

  //       console.log('received', res.rows.length);

  //       //save into Db

  //       const deleteParams = {
  //         QueueUrl: queueUrl,
  //         ReceiptHandle: message.ReceiptHandle as string,
  //       };
  //       sqs.deleteMessage(deleteParams, (err, data) => {
  //         if (err) {
  //           console.log('Delete Error', err);
  //         } else {
  //           console.log('Message Deleted');
  //           receiveMessageListener();
  //         }
  //       });
  //     });
  //   } else {
  //     receiveMessageListener();
  //   }
  // });
}
