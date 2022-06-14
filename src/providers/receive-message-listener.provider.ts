import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchRequestEntry,
  ReceiveMessageCommand,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {v4 as uuidv4} from 'uuid';
import {TestDataSource} from '../datasources';
import {ackQueueUrl, client, dataQueueUrl} from './send-message.provider';

export const fileCount = new Map<string, number>();
const maxCount = 10; // MAKE CONFIGURABLE
// let remainingMessages = Infinity;

@injectable({scope: BindingScope.TRANSIENT})
export class ReceiveMessageListenerProvider implements Provider<() => void> {
  constructor(
    @inject('datasources.test') private dataSource: TestDataSource, // @inject('repositories.TestRepository')
  ) // private testRepository: TestRepository, worksss
  {}

  value() {
    return () => this.receiveInvoker();
  }

  receiveInvoker() {
    let count = 0;
    setInterval(() => {
      if (
        count < maxCount
        // &&
        // count < Math.ceil(remainingMessages / batchSize) + 1
      ) {
        count++;
        this.receiveMessageListener().then(() => {
          count--;
        });
      }
    }, 0);
  }

  async receiveMessageListener() {
    // const path = __dirname + '/receive-worker-file.js';
    // const worker = new Worker(path);
    // worker.on('message', message => {

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

      // const queueInfo = await client.send(
      //   new GetQueueAttributesCommand({
      //     QueueUrl: dataQueueUrl,
      //     AttributeNames: ['ApproximateNumberOfMessages'],
      //   }),
      // );
      // remainingMessages = parseInt(
      //   queueInfo.Attributes?.ApproximateNumberOfMessages as string,
      // );

      data.Messages.forEach(message => {
        const data: {rows: any[]; types: Record<string, string>[]} = JSON.parse(
          message.Body as string,
        );

        //invoke provider.
        this.saveToDb(data);

        const count = (fileCount.get(fileId) ?? 0) + data.rows.length;
        fileCount.set(fileId, count);
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

      // check if current level is finished for file and send ack
      const count = fileCount.get(fileId);
      if (count === totalRows) {
        const input = {
          QueueUrl: ackQueueUrl,
          MessageBody: fileId,
        };
        client.send(new SendMessageCommand(input));
        fileCount.set(fileId, 0);
      }
    }
  }

  saveToDb(data: {rows: any; types?: Record<string, string>[]}) {
    let command = `INSERT INTO public.ftest (name, p_start_date, p_end_date, a_start_date, a_end_date, duration, executing_party,party_contact,customizable_field, status, critical, predecessor, dependency, ext_dependency, comments, deliverable, key, workstream, c_milestone, last_updated, baseline_Start, baseline_finish, variance) VALUES `;
    data.rows.forEach((row: {[x: string]: any}, index: number) => {
      const name = this.addslashes(row['Name']);
      const p_start_date = row['Planned Start Date'] ?? '1/1/1';
      const p_end_date = row['Planned End Date'] ?? '1/1/1';
      const a_start_date = row['Actual Start Date'] ?? '1/1/1';
      const a_end_date = row['Actual End Date'] ?? '1/1/1';
      const duration = row['Duration'];
      const executing_party = row['Executing Party'];
      const party_contact = row['Party Contact'];
      const c_field = row['Customizable field'];
      const status = row['Status'];
      const critical = row['Critical [Yes/No]'];
      const predecessor = row['Predecessor'] ?? 0;
      const dependency = this.addslashes(row['Dependency']);
      const ext_dependency = this.addslashes(row['Ext. Dependency']);
      const comments = this.addslashes(row['Comments']);
      const deliverable = row['Deliverable [YES/NO]'];
      const key = row['Key Contractual Milestones'];
      const workstream = row['Workstream'];
      const milestone = row['Contractual Milestone [YES/NO]'];
      const last_updated = row['Last Updated'];
      const baseline_start = row['Baseline Start'] ?? '1/1/1';
      const baseline_finish = row['Baseline Finish'] ?? '1/1/1';
      const variance = row['Variance'] ?? 0;
      command += ` (E'${name}'::character varying, '${p_start_date}'::date, '${p_end_date}'::date, '${a_start_date}'::date, '${a_end_date}'::date,'${duration}'::character varying,'${executing_party}'::character varying, '${party_contact}'::character varying,'${c_field}'::character varying, '${status}'::character varying, '${critical}'::character varying, '${predecessor}'::numeric, E'${dependency}'::character varying, E'${ext_dependency}'::character varying, E'${comments}'::character varying, '${deliverable}'::character varying, '${key}'::character varying, '${workstream}'::character varying, '${milestone}'::character varying, '${last_updated}'::character varying, '${baseline_start}'::date, '${baseline_finish}'::date, '${variance}'::numeric), `;
      if (index === data.rows.length - 1) {
        this.executeCommand(command.substring(0, command.length - 2));
      }
    });
  }
  async executeCommand(command: string) {
    try {
      await this.dataSource.execute(command);
      console.timeLog('receive');
    } catch (err) {
      console.log(err);
      console.log(command);
      throw new Error(err);
    }
  }

  addslashes(str: string) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  }
}
